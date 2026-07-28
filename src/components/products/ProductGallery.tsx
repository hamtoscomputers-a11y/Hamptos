import { useState } from "react"
import { Zap } from "lucide-react"

interface ProductGalleryProps {
  /** Primary product image. */
  image: string
  /** Additional photos from the ERP; often empty. */
  photos?: string[]
  name: string
  /** Draws the amber "FLASH SALE" ribbon — set when a promo undercuts the list price. */
  onSale?: boolean
}

/**
 * Product image with a vertical thumbnail rail to its left, per the Figma's
 * 614 x 509 frame (a ~90px rail, 15px gutter, then a square image well). The
 * thumbnails hold whatever photos the ERP returns; a lone photo drops the rail.
 */
const ProductGallery = ({ image, photos = [], name, onSale }: ProductGalleryProps) => {
  // The main image leads the rail, then any extra photos, de-duplicated.
  const allImages = [image, ...photos].filter(Boolean).filter((url, i, list) => list.indexOf(url) === i)
  const [active, setActive] = useState(image)

  return (
    <div className="flex gap-[15px]">
      {/* A lone photo needs no picker. */}
      {allImages.length > 1 && (
        <div className="flex w-[74px] flex-shrink-0 flex-col gap-[15px] sm:w-[90px]">
          {allImages.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(url)}
              aria-label={`Show image of ${name}`}
              aria-pressed={active === url}
              className={`flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-white p-1.5 transition-colors ${
                active === url ? "border-brand-700" : "border-surface-line hover:border-ink-faint"
              }`}
            >
              <img src={url} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Square image well; the ribbon rides its top-left corner. */}
      <div className="relative flex-1">
        {onSale && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-md bg-flash px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            <Zap size={12} fill="currentColor" strokeWidth={0} aria-hidden />
            Flash Sale
          </span>
        )}
        <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-6">
          <img src={active} alt={name} className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  )
}

export default ProductGallery
