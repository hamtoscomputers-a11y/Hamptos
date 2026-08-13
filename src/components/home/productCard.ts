/**
 * Normalises a raw ERP product into what the card renders.
 *
 * Only fields the API actually returns are mapped. Notably absent from the
 * API and therefore never faked here: any delivery-date, fulfilment or
 * shipping-promise field. See CardProduct.
 */
export interface CardProduct {
  id: string
  name: string
  slug: string
  image: string
  /** Price the customer pays: promo_price when present, else price. */
  price: number
  /** Struck-through original — only set when a real promo undercuts price. */
  originalPrice?: number
  /** Whole-percent saving, only when originalPrice applies. */
  discountPercent?: number
  inStock: boolean
}

const toNumber = (value: unknown): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const buildImageUrl = (image?: string): string =>
  image ? `${import.meta.env.VITE_REACT_APP_API_URI}/assets/uploads/${image}` : ""

/**
 * The card's artwork, from whichever field this endpoint happens to fill.
 *
 * The ERP hands the main photo over two different ways. `products/view` sends
 * `image` as a bare file name, to be joined onto the uploads folder. The list
 * endpoints — `products`, `category_products`, the collections — send
 * `image: null` and put a ready absolute URL in `image_url` instead.
 *
 * Reading only `image` is why every card in the Related Products rail rendered
 * as a grey box: the row had a perfectly good `image_url` sitting next to a
 * null the mapper was looking at.
 *
 * `photos[0]` is the last resort, for a product whose main image was never set
 * but which has gallery shots.
 */
const resolveCardImage = (item: any): string => {
  const ready = typeof item?.image_url === "string" ? item.image_url.trim() : ""
  if (ready) return ready

  const built = buildImageUrl(item?.image)
  if (built) return built

  const first = Array.isArray(item?.photos) ? item.photos[0] : undefined
  const photo = typeof first?.photo_url === "string" ? first.photo_url.trim() : ""

  return photo || buildImageUrl(first?.photo)
}

export const toCardProduct = (item: any): CardProduct => {
  const price = toNumber(item?.price)
  const promo = toNumber(item?.promo_price)
  const hasPromo = promo > 0 && promo < price

  return {
    id: String(item?.id ?? ""),
    name: item?.name ?? "",
    slug: item?.slug || "",
    image: resolveCardImage(item),
    price: hasPromo ? promo : price,
    originalPrice: hasPromo ? price : undefined,
    discountPercent: hasPromo ? Math.round(((price - promo) / price) * 100) : undefined,
    inStock: toNumber(item?.quantity) > 0,
  }
}

export const formatAed = (value: number): string =>
  value.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
