import { useState } from "react"

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
    <div>
      {/* The Figma sets the ribbon on its own line above the rail, flush with the
          rail's left edge — not over the photo, where it covered the product. */}
      {onSale && (
        <span className="mb-[15px] inline-flex h-6 items-center gap-[5px] rounded-[4px] bg-flash px-[10px] py-[5px] text-[10px] font-bold uppercase leading-[14px] text-ink-ribbon">
          <span aria-hidden>🔥</span>
          Flash Sale
        </span>
      )}

      <div className="flex gap-[15px]">
        {/* A lone photo needs no picker. */}
        {allImages.length > 1 && (
          /* The Figma caps the rail at 500 tall with a 15 gap, which fits five
             89.74 squares. Anything beyond that scrolls rather than running the
             column past the photo — a product can carry any number of images.
             max-h, not h, so three images do not leave 200px of blank column. */
          <div className="scrollbar-hidden flex max-h-[500px] w-[74px] flex-shrink-0 flex-col gap-[15px] overflow-y-auto sm:w-[89.74px]">
            {allImages.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => setActive(url)}
                aria-label={`Show image of ${name}`}
                aria-pressed={active === url}
                className={`flex aspect-square w-full flex-shrink-0 items-center justify-center overflow-hidden border bg-white p-1.5 transition-colors ${
                  active === url ? "border-brand-700" : "border-black/30 hover:border-ink-faint"
                }`}
              >
                <img src={url} alt="" className="max-h-full max-w-full object-contain" />
              </button>
            ))}
          </div>
        )}

        {/* Square image well. */}
        <div className="flex-1">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-6">
            <img src={active} alt={name} className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductGallery
