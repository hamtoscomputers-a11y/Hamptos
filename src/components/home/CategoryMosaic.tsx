import { Link } from "react-router-dom"
import { usePromoBanners } from "@/api/hooks/useProducts"
import { toSearchHref } from "@/components/header/navigation"
import switchesArtwork from "@/assets/category-switches.png"

interface MosaicTile {
  label: string
  /** Tailwind fill for the tile. */
  tone: string
  /** Label colour, for the one tile that carries a dark fill. */
  labelTone?: string
  /** Full-height tiles occupy both rows of the mosaic. */
  tall?: boolean
  /** Pushes the label to the foot of the tile rather than the head. */
  labelAtFoot?: boolean
  /**
   * How this tile wears its picture.
   *
   * `contain` is a product cut-out standing on the tile's own fill, which is
   * why the Switches tile stays white behind its stack of switches. `cover` is
   * a photograph filling the tile edge to edge, as the other five carry in the
   * Figma — those need white type over a scrim, since the picture reaches
   * behind the label.
   */
  fit: "contain" | "cover"
  /** Shipped artwork, used until the block is filled in from the ERP. */
  artwork?: string
}

/**
 * The six tiles of the Figma mosaic, in visual order.
 *
 * Curated groupings, not ERP categories: the catalogue has no `Firewalls`,
 * `Storages` or `Ip Phones` category, and the ones it does have — `Switches`
 * among them — hold zero products, since almost everything sits under
 * `Networking`. So each tile resolves through the same search route the header
 * nav already uses for these exact labels, and the two stay in step.
 */
/**
 * Hairline strokes, measured off each tile in the Figma. Deliberately uneven:
 * the warm cream and lilac column carries a 21% stroke while the white and
 * cool-tinted tiles carry 7%, and the blue tile has none at all. There are no
 * drop shadows anywhere in the design — the tiles are separated by their
 * strokes alone.
 */
const EDGE_FAINT = "border border-black/[0.07]"
const EDGE_STRONG = "border border-black/[0.21]"

const TILES: MosaicTile[] = [
  { label: "Switches", tone: `bg-white ${EDGE_FAINT}`, tall: true, fit: "contain", artwork: switchesArtwork },
  { label: "Firewalls", tone: `bg-surface-tint-blue ${EDGE_FAINT}`, fit: "cover" },
  // The Figma leaves this tile's label off — an empty tile with nothing to
  // click. The underlying Figma file names the layer `Wireless`, and the
  // header nav carries the same entry, so it is labelled to match.
  { label: "Wireless", tone: `bg-surface-tint-mint ${EDGE_FAINT}`, fit: "cover" },
  {
    label: "Servers",
    tone: "bg-brand-700",
    labelTone: "text-white",
    tall: true,
    labelAtFoot: true,
    fit: "cover",
  },
  { label: "Storages", tone: `bg-surface-tint-cream ${EDGE_STRONG}`, fit: "cover" },
  { label: "Ip Phones", tone: `bg-surface-tint-lilac ${EDGE_STRONG}`, fit: "cover" },
]

/**
 * Column widths, as ratios of the Figma's 1297x397 frame — the outer two are
 * measured exactly (327 and 316), the inner two divide the remainder.
 * Deliberately uneven: the mosaic is not a regular four-up grid, and equal
 * columns visibly shift the blue `Servers` block off its mark.
 */
const COLUMNS = "lg:grid-cols-[327fr_327fr_294fr_316fr]"

const Tile = ({ tile }: { tile: MosaicTile }) => {
  // A photograph reaches behind the label, so the type has to switch to white
  // over a scrim. The tile's own `labelTone` only covers the case where the
  // *fill* is dark — `Servers` on blue — which is a different question.
  const photo = tile.fit === "cover" && Boolean(tile.artwork)

  return (
    <Link
      to={toSearchHref(tile.label)}
      className={`group relative flex min-h-[140px] flex-col overflow-hidden rounded-[15px] p-5 transition-colors hover:border-black/30 lg:min-h-0 lg:p-7 ${tile.tone} ${
        tile.tall ? "lg:row-span-2" : ""
      } ${tile.labelAtFoot ? "justify-end" : ""}`}
    >
      {tile.artwork && (
        /* Full-bleed behind the padding and sized by the tile's height, which is
           how the Figma places it. Absolute rather than in flow, so the label
           keeps its position at the head of the tile whatever the image does. */
        <img
          src={tile.artwork}
          alt=""
          aria-hidden
          loading="lazy"
          /* A cut-out is held to the lower two thirds until `lg`, where the tile
             is finally tall enough for it to run full height without reaching up
             into the label. A photograph always fills the tile — cropping it to
             two thirds would leave a band of bare fill above it. Sized with an
             explicit height rather than `top`/`bottom`: an img is a replaced
             element, so it takes its intrinsic height and ignores `bottom`. */
          className={`pointer-events-none absolute inset-x-0 bottom-0 w-full transition-transform duration-300 group-hover:scale-[1.03] ${
            photo ? "h-full object-cover" : "h-2/3 object-contain object-bottom lg:h-full"
          }`}
        />
      )}

      {/* Dark where the label sits, clear at the far end. The artwork is
          uploaded by the shop and could be anything, so white type needs
          something behind it or a pale photo swallows it. */}
      {photo && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            tile.labelAtFoot
              ? "bg-gradient-to-t from-black/65 via-black/20 to-transparent"
              : "bg-gradient-to-b from-black/65 via-black/20 to-transparent"
          }`}
        />
      )}

      <span
        className={`relative text-[20px] leading-tight lg:text-[24px] ${
          photo ? "text-white drop-shadow-sm" : (tile.labelTone ?? "text-black")
        }`}
      >
        {tile.label}
      </span>
    </Link>
  )
}

/**
 * Homepage category mosaic — the asymmetric tile block beneath the hero.
 *
 * The tiles themselves are fixed: labels, sizes, fills and destinations are a
 * curated shortcut rail rather than a view of the catalogue, and the ERP's
 * category tree cannot drive them (see `TILES`). Only the artwork comes from
 * the ERP, under the `home_category_mosaic` block of Promo Banners, where slot
 * order maps onto the six tiles above.
 *
 * Pictures fill the tiles in the order the ERP lists them, which is the same
 * rule the product page's mosaic already follows — one convention across that
 * admin screen rather than two. It does mean the block has no notion of a gap:
 * upload artwork for the second tile only and it lands on the first. The admin
 * hint says so, and a misordered tile is visible on the home page rather than
 * silently wrong, so it corrects itself by re-ordering the rows.
 */
const CategoryMosaic = () => {
  const { data } = usePromoBanners()

  const artwork = data?.home_category_mosaic ?? []
  const tiles = TILES.map((tile, index) => {
    const image = artwork[index]?.image
    return image ? { ...tile, artwork: image } : tile
  })

  return (
    <section aria-label="Shop by category" className="bg-white py-8">
      <div className="container mx-auto px-4">
        {/* Two 191px rows and a 15px gutter make the Figma's 397px frame; the
            columns are gutted at 11px, which is why the two axes differ.
            Column flow, not the default row flow: the two full-height tiles
            would otherwise push the half-height ones into the wrong columns —
            `Servers` lands in the fourth rather than the third. */}
        <div
          className={`grid grid-cols-2 gap-x-[11px] gap-y-[15px] sm:grid-cols-3 lg:h-[397px] lg:grid-flow-col lg:grid-rows-2 ${COLUMNS}`}
        >
          {tiles.map((tile) => (
            <Tile key={tile.label} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryMosaic
