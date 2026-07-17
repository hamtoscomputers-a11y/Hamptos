import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useBestSellers } from "@/api/hooks/useProducts"
import { createSlug } from "@/lib/utils"
import showcaseImg from "@/assets/bestSelling.png"
import { formatAed, toCardProduct, type CardProduct } from "./productCard"

const TITLE = "Best Selling Product"
const SUBTITLE = "Effortless upgrades your system, at price you'll love."
const TILE_COUNT = 4

/**
 * Single tile in the 2x2 grid.
 *
 * The Figma shows an "Up to X% Off" line. That is only truthful when the ERP
 * returns a `promo_price` below `price` — no product currently does, so the
 * tile falls back to the real price rather than inventing a discount.
 */
const ShowcaseTile = ({ product }: { product: CardProduct }) => (
  <Link
    to={`/product/${createSlug(product.name)}`}
    state={{ productId: product.id }}
    className="group flex flex-col items-center justify-start gap-3 bg-promo-gradient p-5 text-center transition-opacity hover:opacity-90"
  >
    <div className="flex h-24 w-full items-center justify-center">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-24 w-auto object-contain mix-blend-multiply"
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden"
          }}
        />
      )}
    </div>

    <h3 className="line-clamp-2 text-sm font-semibold text-[#111111]" title={product.name}>
      {product.name}
    </h3>

    {product.discountPercent !== undefined ? (
      <p className="text-xs text-[#151515]">Up to {product.discountPercent}% Off</p>
    ) : (
      <p className="text-xs text-[#151515]">
        AED <span className="font-semibold text-brand-700">{formatAed(product.price)}</span>
      </p>
    )}
  </Link>
)

const BestSellingShowcase = () => {
  const { data, isLoading, error } = useBestSellers(TILE_COUNT, 1, "brand,category,photos")

  const products = useMemo(
    () => (data?.data ?? []).map(toCardProduct).filter((p) => p.name).slice(0, TILE_COUNT),
    [data],
  )

  if (error || (!isLoading && products.length === 0)) return null

  return (
    <section aria-label={TITLE} className="container mx-auto px-4">
      <div className="grid overflow-hidden rounded-lg lg:grid-cols-2">
        {/* Left: static showcase artwork + copy */}
        <div className="flex flex-col items-center justify-center gap-4 bg-surface-promo p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#0B0B0B]">{TITLE}</h2>
            <p className="mx-auto mt-1 max-w-xs text-xs text-[#151515]">{SUBTITLE}</p>
          </div>
          <img src={showcaseImg} alt="" aria-hidden className="max-h-64 w-auto object-contain" />
        </div>

        {/* Right: live best-seller tiles */}
        <div className="grid grid-cols-2 gap-px bg-white">
          {isLoading
            ? Array.from({ length: TILE_COUNT }).map((_, index) => (
                <div key={index} className="animate-pulse bg-promo-gradient p-5">
                  <div className="mx-auto h-24 w-24 rounded bg-white/50" />
                  <div className="mx-auto mt-3 h-3 w-3/4 rounded bg-white/50" />
                  <div className="mx-auto mt-2 h-3 w-1/2 rounded bg-white/50" />
                </div>
              ))
            : products.map((product) => <ShowcaseTile key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  )
}

export default BestSellingShowcase
