import { useState } from "react"
import { usePromoBanners } from "@/api/hooks/useProducts"

export interface PromoTile {
  id: string
  /** Artwork URL. Bundled asset, absolute URL, or a path under `public/`. */
  image: string
  /** Describes the artwork; the copy in the Figma is painted into it. */
  alt: string
  /** Optional destination. The tile is inert without one. */
  href?: string
}

interface PromoMosaicProps {
  /**
   * Overrides the ERP's tiles, in the Figma's order: top-left, bottom-left,
   * centre, top-right, bottom-right.
   */
  tiles?: PromoTile[]
}

/**
 * Stand-ins for before any tile has been set up in the ERP, served from
 * `public/`. The Figma paints each tile's copy into its own image, which is how
 * `PromoTileBand` on the home page already treats slider artwork.
 */
const PLACEHOLDER_TILES: PromoTile[] = [
  { id: "delivery", image: "/promo-1.png", alt: "Faster Delivery, UAE Ready — 48H worldwide shipping" },
  { id: "lower-left", image: "/promo-2.png", alt: "" },
  { id: "centre", image: "/promo-3.png", alt: "" },
  { id: "upper-right", image: "/promo-4.png", alt: "" },
  { id: "lower-right", image: "/promo-5.png", alt: "" },
]

/** 20.88 corners over the `#D3D3D3` placeholder fill, per the Figma. */
const TILE = "block overflow-hidden rounded-[20.88px] bg-surface-tile"

const Tile = ({ tile, className, ratio }: { tile?: PromoTile; className: string; ratio: string }) => {
  const [hasImage, setHasImage] = useState(true)

  const artwork =
    tile && hasImage ? (
      <img
        src={tile.image}
        alt={tile.alt}
        loading="lazy"
        onError={() => setHasImage(false)}
        className="h-full w-full object-cover"
      />
    ) : null

  const box = `${TILE} ${ratio} ${className}`

  return tile?.href ? (
    <a href={tile.href} className={box}>
      {artwork}
    </a>
  ) : (
    <div className={box}>{artwork}</div>
  )
}

/**
 * The promo mosaic, per the Figma's 1304 x 574.22 block at x212: three columns
 * of 420.75 across 20.88 gutters, the outer two split into a pair of 276.67
 * tiles and the middle one running the full height.
 *
 *   212 + 420.75 = 632.75, + 20.88 = 653.63  (the centre column's x)
 *   276.67 x 2 + 20.88 = 574.22              (the block's height)
 */
const PromoMosaic = ({ tiles }: PromoMosaicProps) => {
  const { data } = usePromoBanners()

  // Slot order is the ERP's sort order, which the API already applies. A tile
  // with no artwork uploaded is dropped rather than rendered as an empty box,
  // so the remaining tiles close up instead of leaving a hole.
  const fromApi: PromoTile[] = (data?.product_mosaic ?? [])
    .filter((banner) => banner.image)
    .map((banner) => ({
      id: String(banner.id),
      image: banner.image as string,
      alt: banner.alt ?? "",
      href: banner.link ?? undefined,
    }))

  const list = tiles?.length ? tiles : fromApi.length ? fromApi : PLACEHOLDER_TILES
  const [topLeft, bottomLeft, centre, topRight, bottomRight] = list

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-10" aria-label="Why buy from Hamtos">
      {/* Fixed rows only from `lg`; below that the tiles keep their aspect and
          stack, so the block never squashes. */}
      <div className="grid grid-cols-1 gap-[20.88px] sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[276.67px_276.67px]">
        <Tile tile={topLeft} ratio="aspect-[420.75/276.67] lg:aspect-auto" className="lg:col-start-1 lg:row-start-1" />
        <Tile
          tile={bottomLeft}
          ratio="aspect-[420.75/276.67] lg:aspect-auto"
          className="lg:col-start-1 lg:row-start-2"
        />
        <Tile
          tile={centre}
          ratio="aspect-[420.75/574.22] lg:aspect-auto"
          className="lg:col-start-2 lg:row-start-1 lg:row-span-2"
        />
        <Tile tile={topRight} ratio="aspect-[420.75/276.67] lg:aspect-auto" className="lg:col-start-3 lg:row-start-1" />
        <Tile
          tile={bottomRight}
          ratio="aspect-[420.75/276.67] lg:aspect-auto"
          className="lg:col-start-3 lg:row-start-2"
        />
      </div>
    </section>
  )
}

export default PromoMosaic
