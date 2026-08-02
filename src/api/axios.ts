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
 * Production is served from the same host as the API and is unaffected.
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
 * The homepage opens ~25 requests on mount (two category trees, brands,
 * slider, several category rails and the search fallbacks), landing on top of
 * that ceiling every load. Everything queues through here instead, at a depth
 * well under the point where the failures start.
 */
const MAX_CONCURRENT_REQUESTS = 5;

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

const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config: QueuedRequestConfig) => {
    // Get API key from localStorage or environment
    const apiKey = import.meta.env.VITE_API_KEY;

    if (apiKey) {
      config.headers.set('api-key', apiKey);
    } else {
      config.headers.set('api-key', 's40cs8wg4cwwo8cgsko0o4g88www8g4co8w4k004');
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
