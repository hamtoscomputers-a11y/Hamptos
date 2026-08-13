import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Where the API lives.
 *
 * In development this is empty, so every path stays relative and goes through
 * Vite's `/api` proxy (see `vite.config.ts`) instead of straight at
 * portal.hamtos.com. The ERP does send correct CORS headers — but it sends
 * them from PHP, so a request whose worker dies before the application runs
 * comes back with none at all. Chrome then reports a genuine `500` as
 * "No 'Access-Control-Allow-Origin' header is present", which hides the real
 * failure behind a CORS message that has nothing to do with it. Proxying in
 * dev makes those requests same-origin, so a 500 reads as a 500.
 *
 * Production still calls portal.hamtos.com across origins — the storefront is
 * served from hamtos.com — and there is no proxy in front of it. That works:
 * the ERP answers with `access-control-allow-origin: *`. But it means a
 * production 500 reports as a CORS error there too, so the gate below is what
 * keeps it from happening rather than the baseURL.
 */
const baseURL = import.meta.env.DEV ? '' : import.meta.env.VITE_REACT_APP_API_URL;

/**
 * How many requests may be in flight at once.
 *
 * portal.hamtos.com runs on shared hosting with a hard ceiling on concurrent
 * PHP workers, and a request that exceeds it is killed rather than queued: it
 * returns `HTTP 500` with `content-length: 0` and no body, which is a fatal
 * (the vendor docs ask for a 256MB memory limit for exactly this reason).
 *
 * Measured against the live API rather than assumed — the same endpoint, fired
 * N ways at once:
 *
 *     4, 6, 8, 10, 14 concurrent  ->  all 200
 *     18 concurrent               ->  7 of 18 come back 500
 *
 * The homepage used to open ~25 of them on mount and land on top of that
 * ceiling every load. Queued through here it opens 15, at a depth well under
 * where the failures start.
 *
 * This gate is not the whole picture. The page also pulls ~36 product images
 * from the same host, outside axios and so outside this queue, which puts the
 * real peak nearer 40 connections. Those are static and cached for a week, so
 * they cost the server far less than an API call, but under a cold burst the
 * reads alongside them can still be refused. That is what the retry below is
 * for.
 *
 * Lowered from 5 to 3 after reading the ERP's own log, which named the failure
 * the 500s were hiding:
 *
 *     mysqli::real_connect(): (HY000/2002): Operation not permitted
 *
 * `EPERM` on connect is the *host* refusing the socket, not MySQL refusing the
 * login — a shared-hosting process limit rather than `max_connections`, which
 * would say so. Six concurrent reads on their own all return 200; it is the
 * homepage's whole opening burst together that crosses the line. So the fix is
 * mostly to stop opening that burst at all (the rails now wait until they are
 * scrolled to — see useInViewOnce), and this is the backstop.
 */
const MAX_CONCURRENT_REQUESTS = 3;

/** Extra attempts after the first. Two covers a transient worker death. */
const MAX_RETRIES = 2;

/** First backoff step; doubles per attempt, then jittered. */
const RETRY_BASE_DELAY_MS = 300;

/**
 * Only replayed methods. The API is read-only in practice, but a retry must
 * never be able to submit an order or a contact form twice.
 */
const REPLAYABLE_METHODS = new Set(['get', 'head', 'options']);

interface QueuedRequestConfig extends InternalAxiosRequestConfig {
  /** Set while this request holds one of the slots above. */
  __hasSlot?: boolean;
  __retryCount?: number;
}

let activeRequests = 0;
const waiting: Array<() => void> = [];

/** Resolves once a slot is free — immediately, if one already is. */
const acquireSlot = (): Promise<void> =>
  new Promise((resolve) => {
    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      activeRequests += 1;
      resolve();
      return;
    }
    waiting.push(resolve);
  });

/**
 * Hands the slot to whoever is next in line rather than freeing and
 * re-counting it, so a queued request cannot lose the slot to one that arrives
 * in the same tick.
 */
const releaseSlot = (config?: QueuedRequestConfig) => {
  if (!config?.__hasSlot) return;
  config.__hasSlot = false;

  const next = waiting.shift();
  if (next) next();
  else activeRequests -= 1;
};

/**
 * Whether a response is really the ERP's installer wearing a 200.
 *
 * Stock Manager Advance redirects to `install/index.php` whenever it cannot
 * reach the database (`app/hooks/Sma_hooks.php`), and on shared hosting that
 * fires whenever the account's MySQL connection allowance is momentarily used
 * up — not only on a fresh copy. Two things make it poisonous to a caller:
 *
 *   - It is a 302, so the browser follows it and the request settles on 200.
 *     Nothing in the status says the read failed.
 *   - The redirect is relative, so it resolves against the path already in
 *     hand: `/api/v1/products/` + `install/index.php`, which redirects again to
 *     `install/install/index.php`, and again. Measured on the live homepage:
 *     one page load climbed to `install/install/install/install/install/` and
 *     spent twenty-odd requests getting there.
 *
 * What finally arrives is a PHP `var_export` dump beginning `array (`, not
 * JSON. Callers that read `data.results.products` off it see `undefined`, take
 * it for an empty result, and render nothing — which is exactly how two of the
 * homepage's product rails came to be blank while the products existed.
 *
 * Detected here rather than in any one caller so every endpoint is covered, and
 * so it can be turned back into the failure it always was and replayed by the
 * retry below. Backing off is the right answer: the connection was busy, not
 * empty.
 */
const isInstallerResponse = (response: AxiosResponse) => {
  const url = (response.request?.responseURL ?? '') as string;
  if (url.includes('/install/')) return true;

  // Fallback for anything that does not expose the final URL. The dump is a
  // string where JSON would have been parsed into an object.
  return typeof response.data === 'string' && /^\s*array\s*\(/.test(response.data);
};

const isReplayable = (error: AxiosError) => {
  // An aborted request was not a failure — a component unmounted, or a newer
  // search superseded it. Checked by code rather than `axios.isCancel`, whose
  // type guard narrows the remaining branch to `never`.
  if (error.code === AxiosError.ERR_CANCELED) return false;

  const method = (error.config?.method ?? 'get').toLowerCase();
  if (!REPLAYABLE_METHODS.has(method)) return false;

  // No response at all — a timeout, a dropped connection, or the CORS-shaped
  // report of a crashed worker described above. All of them are worth one
  // more try; none of them means the request was understood and refused.
  if (!error.response) return true;

  return error.response.status >= 500;
};

const API_KEY = import.meta.env.VITE_API_KEY || 's40cs8wg4cwwo8cgsko0o4g88www8g4co8w4k004';

/**
 * `Content-Type` is deliberately not set here.
 *
 * On a GET it describes a body that does not exist, and `application/json` is
 * not a CORS-safelisted value — setting it globally made every read a
 * preflighted request. It is applied per-request below, to the methods that
 * actually carry a body.
 */
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  async (config: QueuedRequestConfig) => {
    const method = (config.method ?? 'get').toLowerCase();

    /**
     * Reads authenticate by query string; writes by header.
     *
     * An `api-key` *header* is a non-safelisted header, so the browser must
     * send a preflight `OPTIONS` before every cross-origin read — and the ERP
     * returns no `access-control-max-age`, so Chrome only caches that
     * permission for 5 seconds and re-asks almost every time. That doubled the
     * request count against the very server that is failing under request
     * count, and it did so invisibly: the preflight is issued by the browser,
     * not by axios, so it never passed through the queue below.
     *
     * Sent as `?api-key=` instead, a read carries no custom header and no
     * content type, which makes it a simple request the browser issues
     * directly. The ERP documents this form ("You can pass api-key as query
     * string") and it was verified against every endpoint this app calls.
     * Writes keep the header — they are rare, and one preflight on a form
     * submission costs nothing.
     */
    if (method === 'get' || method === 'head') {
      config.params = { ...(config.params ?? {}), 'api-key': API_KEY };
    } else {
      config.headers.set('api-key', API_KEY);
      config.headers.set('Content-Type', 'application/json');
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
      });
    }

    // Held until the response comes back. The timeout above is unaffected:
    // axios starts that clock when the adapter runs, which is after this.
    await acquireSlot();
    config.__hasSlot = true;

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Slot release. Registered before the retry interceptor below so a replay
// queues for a fresh slot instead of deadlocking behind its own.
api.interceptors.response.use(
  (response: AxiosResponse) => {
    releaseSlot(response.config as QueuedRequestConfig);
    return response;
  },
  (error: AxiosError) => {
    releaseSlot(error.config as QueuedRequestConfig);
    return Promise.reject(error);
  }
);

// A database-refused read arrives as a 200 (see isInstallerResponse). Turned
// back into a rejection here, before the retry interceptor below, so it is
// replayed like the 500 it should have been. No `response` on the error, which
// is what marks it replayable — the request was never answered on its merits.
api.interceptors.response.use((response: AxiosResponse) => {
  if (!isInstallerResponse(response)) return response;

  return Promise.reject(
    new AxiosError(
      'The ERP redirected to its installer — database unavailable.',
      AxiosError.ERR_BAD_RESPONSE,
      response.config,
      response.request,
    ),
  );
});

// Retry. This is the only retry layer in the app — react-query is configured
// with `retry: false` in App.tsx, because retrying there as well would
// multiply every failure against an API that is already refusing work, and
// would do it outside this file's concurrency gate.
api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as QueuedRequestConfig | undefined;
  if (!config || !isReplayable(error)) return Promise.reject(error);

  const attempt = (config.__retryCount ?? 0) + 1;
  if (attempt > MAX_RETRIES) return Promise.reject(error);
  config.__retryCount = attempt;

  // Jittered so a burst that failed together does not return together.
  const delay = RETRY_BASE_DELAY_MS * 2 ** (attempt - 1) * (0.5 + Math.random());
  await new Promise((resolve) => setTimeout(resolve, delay));

  return api(config);
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        url: response.config.url,
      });
    }

    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.error('Bad request:', data);
          break;
        case 401:
          console.error('Unauthorized access');
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error(`HTTP Error ${status}:`, data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
