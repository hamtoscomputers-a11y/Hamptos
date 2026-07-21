import { Link } from "react-router-dom"
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
  { label: "Switches", tone: `bg-white ${EDGE_FAINT}`, tall: true, artwork: switchesArtwork },
  { label: "Firewalls", tone: `bg-surface-tint-blue ${EDGE_FAINT}` },
  // The Figma leaves this tile's label off — an empty tile with nothing to
  // click. The underlying Figma file names the layer `Wireless`, and the
  // header nav carries the same entry, so it is labelled to match.
  { label: "Wireless", tone: `bg-surface-tint-mint ${EDGE_FAINT}` },
  { label: "Servers", tone: "bg-brand-700", labelTone: "text-white", tall: true, labelAtFoot: true },
  { label: "Storages", tone: `bg-surface-tint-cream ${EDGE_STRONG}` },
  { label: "Ip Phones", tone: `bg-surface-tint-lilac ${EDGE_STRONG}` },
]

/**
 * Column widths, as ratios of the Figma's 1297x397 frame — the outer two are
 * measured exactly (327 and 316), the inner two divide the remainder.
 * Deliberately uneven: the mosaic is not a regular four-up grid, and equal
 * columns visibly shift the blue `Servers` block off its mark.
 */
const COLUMNS = "lg:grid-cols-[327fr_327fr_294fr_316fr]"

const Tile = ({ tile }: { tile: MosaicTile }) => (
  <Link
    to={toSearchHref(tile.label)}
    className={`group relative flex min-h-[140px] flex-col overflow-hidden rounded-[15px] p-5 transition-colors hover:border-black/30 lg:min-h-0 lg:p-7 ${tile.tone} ${
      tile.tall ? "lg:row-span-2" : ""
    } ${tile.labelAtFoot ? "justify-end" : ""}`}
  >
    {tile.artwork && (
      /* Full-bleed behind the padding and sized by the tile's height, which is
         how the Figma places it: the artwork stands about 85% of the tile wide
         and runs to its foot. Absolute rather than in flow, so the label keeps
         its position at the head of the tile whatever the image does. */
      <img
        src={tile.artwork}
        alt=""
        aria-hidden
        loading="lazy"
        /* Held to the lower two thirds until `lg`, where the tile is finally
           tall enough for the artwork to run full height without reaching up
           into the label. Sized with an explicit height rather than
           `top`/`bottom`: an img is a replaced element, so it takes its
           intrinsic height and ignores `bottom` entirely. */
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 w-full object-contain object-bottom transition-transform duration-300 group-hover:scale-[1.03] lg:h-full"
      />
    )}

    <span className={`relative text-[20px] leading-tight lg:text-[24px] ${tile.labelTone ?? "text-black"}`}>
      {tile.label}
    </span>
  </Link>
)

/**
 * Homepage category mosaic — the asymmetric tile block beneath the hero.
 *
 * Static by design: it is a curated shortcut rail rather than a view of the
 * catalogue, so it takes no props and makes no request. See `TILES` for why
 * the ERP's category tree cannot drive it.
 */
const CategoryMosaic = () => (
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
        {TILES.map((tile) => (
          <Tile key={tile.label} tile={tile} />
        ))}
      </div>
    </div>
  </section>
)

export default CategoryMosaic
