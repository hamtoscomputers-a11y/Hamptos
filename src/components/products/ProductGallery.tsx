import { useState } from "react"

interface ProductGalleryProps {
  /** Primary product image. */
  image: string
  /** Additional photos from the ERP; often empty. */
  photos?: string[]
  name: string
}

/**
 * Product image with a thumbnail strip beneath it, per the Figma's 520.5 x 347
 * frame. Square corners, no card chrome — the photo sits directly on the page.
 */
const ProductGallery = ({ image, photos = [], name }: ProductGalleryProps) => {
  // The main image leads the strip, then any extra photos, de-duplicated.
  const allImages = [image, ...photos].filter(Boolean).filter((url, i, list) => list.indexOf(url) === i)
  const [active, setActive] = useState(image)

  return (
    <div>
      <div className="flex h-[347px] w-full max-w-[520px] items-center justify-center bg-white">
        <img
          src={active}
          alt={name}
          className="h-full w-full object-contain"
        />
      </div>

      {/* A lone photo needs no picker. */}
      {allImages.length > 1 && (
        <div className="mt-6 flex flex-wrap gap-[10px]">
          {allImages.map((url) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(url)}
              aria-label={`Show image of ${name}`}
              aria-pressed={active === url}
              className={`flex h-[62px] w-[99px] items-center justify-center border p-1 transition-colors ${
                active === url ? "border-brand-700" : "border-surface-muted hover:border-ink-faint"
              }`}
            >
              <img src={url} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery
