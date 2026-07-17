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

export const toCardProduct = (item: any): CardProduct => {
  const price = toNumber(item?.price)
  const promo = toNumber(item?.promo_price)
  const hasPromo = promo > 0 && promo < price

  return {
    id: String(item?.id ?? ""),
    name: item?.name ?? "",
    slug: item?.slug || "",
    image: buildImageUrl(item?.image),
    price: hasPromo ? promo : price,
    originalPrice: hasPromo ? price : undefined,
    discountPercent: hasPromo ? Math.round(((price - promo) / price) * 100) : undefined,
    inStock: toNumber(item?.quantity) > 0,
  }
}

export const formatAed = (value: number): string =>
  value.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
