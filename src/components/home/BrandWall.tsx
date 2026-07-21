import { Link } from "react-router-dom"
import { useWebsiteBrands } from "@/api/hooks/useProducts"

const TITLE = "Brands we carry"

/**
 * Six across, as the Figma draws it. Rows are however many the ERP fills —
 * the design shows four, but the wall is built from `/website/brands`, so it
 * grows and shrinks with the account rather than being pinned to a count.
 */
const COLUMNS = "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"

/** One Figma row is 242/4 tall; the logos are centred inside it. */
const ROW_HEIGHT = "h-[60px]"

const SKELETON_COUNT = 6

/**
 * Logo wall at the head of the `#F8F8F8` band.
 *
 * The Figma places this as a single flat export — one image of 24 logos — so
 * there is no per-logo artwork to lift out of it. Rendered from the live brand
 * list instead: same treatment, plain logos on the band with no card or border,
 * each linking into its own product listing.
 */
const BrandWall = () => {
  const { data, isLoading, error } = useWebsiteBrands()
  const brands = (data?.data ?? []).filter((brand: any) => brand?.image)

  if (error || (!isLoading && brands.length === 0)) return null

  return (
    <section aria-label={TITLE}>
      <div className="container mx-auto px-4">
        <div className={`grid gap-x-6 gap-y-2 ${COLUMNS}`}>
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div key={index} className={`animate-pulse rounded bg-black/5 ${ROW_HEIGHT}`} />
              ))
            : brands.map((brand: any) => (
                <Link
                  key={brand.id}
                  to={`/brand/${brand.id}/products`}
                  // No hover treatment: fading the logo toward the band washes
                  // it out rather than highlighting it.
                  className={`flex items-center justify-center px-2 ${ROW_HEIGHT}`}
                >
                  <img
                    src={brand.image}
                    alt={brand.name}
                    loading="lazy"
                    // Sized to the cell rather than to the file: the ERP's logo
                    // images vary from tight crops to small padded squares, so
                    // leaving them at their intrinsic size renders the wall at a
                    // dozen different scales. `object-contain` keeps each one's
                    // aspect intact inside the shared box.
                    //
                    // `mix-blend-multiply` drops the white the files are saved
                    // on, so they sit directly on the band the way the Figma's
                    // flat export does.
                    className="h-10 w-full object-contain mix-blend-multiply"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden"
                    }}
                  />
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}

export default BrandWall
