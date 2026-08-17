import { usePromoBanners } from "@/api/hooks/useProducts";
import NewCollectionRail from "./NewCollectionRail";
import { isRouter } from "./productRanges";

const TITLE = "New Routers Collections";

/** 15px corners on every tile, over the `#D3D3D3` placeholder fill. */
const TILE =
  "relative block min-h-0 min-w-0 overflow-hidden rounded-[15px] bg-surface-tile";

/**
 * One box per Figma slot. Desktop keeps the 250 / 244 row heights. Below `lg`
 * each tile uses its own ratio so a 348-wide gaming card is not forced into
 * the 936-wide banner crop — that squash made the next image paint over it.
 */
const TILE_BOX = [
  "aspect-[16/9] sm:aspect-[2.2/1] lg:aspect-auto lg:h-[250px]",
  "aspect-[348/250] lg:aspect-auto lg:h-[250px]",
  "aspect-[344/244] lg:aspect-auto lg:h-[244px]",
  "aspect-[440/244] lg:aspect-auto lg:h-[244px]",
  "aspect-[484/244] lg:aspect-auto lg:h-[244px]",
] as const;

/**
 * One tile.
 *
 * The ERP's slider rows carry `image`, `link` and `caption` and nothing else,
 * so a tile is its artwork — there is no headline or button field to render
 * over it, and the artwork already has that copy painted in.
 */
const PromoTile = ({
  slide,
  isLoading,
  className,
}: {
  slide?: any;
  isLoading: boolean;
  className: string;
}) => {
  if (isLoading)
    return <div className={`${TILE} ${className} animate-pulse`} />;
  if (!slide?.image) return null;

  const href = slide.link
    ? `https://${String(slide.link).replace(/^https?:\/\//, "")}`
    : null;
  const artwork = (
    <img
      src={slide.image}
      alt={slide.caption || ""}
      loading="lazy"
      // Absolute fill + overflow-hidden on the tile: in a stacked grid the
      // image's intrinsic height would otherwise spill into the next card.
      // object-left keeps left-anchored headlines (same as the hero art).
      className="absolute inset-0 h-full w-full object-cover object-left"
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );

  // Clickable only where the ERP actually supplies a destination. Four of the
  // five slides currently return `link: ""`, and inventing a target for those
  // would put a made-up destination in front of a customer. Fill the slide's
  // link field in the ERP and the tile becomes a link with no code change.
  //
  // The ERP stores them as bare hostnames, so they cannot go through the
  // router — a real link gets a plain anchor.
  if (!href) return <div className={`${TILE} ${className}`}>{artwork}</div>;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${TILE} ${className}`}
    >
      {artwork}
    </a>
  );
};

interface PromoTileBandProps {
  /** The `/website/slider` rows, five of them, one per tile. */
  slides: any[];
  isLoading: boolean;
}

/**
 * Blue band carrying the five promo tiles and a product rail.
 *
 * Artwork comes from the Promo Banners block `home_promo_tiles`, and falls back
 * to `/website/slider` until that block has been filled in.
 *
 * The fallback is not the intended source. Those five slider rows also draw the
 * hero, so before this block existed a tile could not be changed without
 * changing the hero with it — and the fifth row was drawn twice over, once here
 * and once as the clearance banner below. The slider now belongs to the hero.
 *
 * `slides` is still handed down rather than fetched: the homepage already loads
 * it for the hero, so taking it as a prop costs no second request.
 *
 * The tile block straddles the band's top edge: 180 of the upper row's 250 sits
 * on the white section above, the rest on the blue. Phones use a smaller lift
 * so the first card still sits on the seam without covering the rail above.
 */
const PromoTileBand = ({ slides, isLoading }: PromoTileBandProps) => {
  const { data, isLoading: bannersLoading } = usePromoBanners();

  // Mapped onto the slide shape the tiles already render, so one component
  // serves both sources. All or nothing: mixing a half-filled block with
  // leftover slider rows would put hero artwork beside the real tiles.
  const tiles = (data?.home_promo_tiles ?? [])
    .filter((banner) => banner.image)
    .map((banner) => ({
      image: banner.image as string,
      link: banner.link ?? "",
      caption: banner.alt ?? "",
    }));

  const source = tiles.length ? tiles : slides;
  const loading = tiles.length ? false : isLoading || bannersLoading;

  return <Band slides={source} isLoading={loading} />;
};

const Band = ({ slides, isLoading }: PromoTileBandProps) => (
  /* Not a landmark itself — the tile grid and the rail inside it are each
       labelled, and nesting a third region with the rail's own name makes the
       page announce it twice. */
  /* `flex` is load-bearing: without it the tile block's negative top margin
       collapses through this element and drags the blue up with it, so the
       band starts level with the tiles instead of 180 below their top. */
  <div className="mt-8 flex flex-col bg-brand-700 lg:mt-[256px]">
    <section
      aria-label="Promotional banners"
      className="container mx-auto px-4"
    >
      {/* Desktop straddles 180px onto the white above. Phones get a smaller
          lift so the first card sits on the seam instead of leaving a blue
          strip above it. */}
      <div className="relative z-10 -mt-8 space-y-4 lg:-mt-[180px] lg:space-y-[22px]">
        {/* 936 | 348 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[936fr_348fr]">
          <PromoTile
            slide={slides[0]}
            isLoading={isLoading}
            className={TILE_BOX[0]}
          />
          <PromoTile
            slide={slides[1]}
            isLoading={isLoading}
            className={TILE_BOX[1]}
          />
        </div>

        {/* 344 | 440 | 484 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[344fr_440fr_484fr]">
          <PromoTile
            slide={slides[2]}
            isLoading={isLoading}
            className={TILE_BOX[2]}
          />
          <PromoTile
            slide={slides[3]}
            isLoading={isLoading}
            className={TILE_BOX[3]}
          />
          <PromoTile
            slide={slides[4]}
            isLoading={isLoading}
            className={TILE_BOX[4]}
          />
        </div>
      </div>
    </section>

    {/* 130 between the tiles and the rail, 114 of blue below it — measured
          off the Figma, where the band ends 114 under the cards and the banner
          follows 79 later. */}
    <div className="pb-10 pt-8 md:pb-[114px] md:pt-[130px]">
      <NewCollectionRail
        title={TITLE}
        match={isRouter}
        // Routers are all older stock, so none fall inside the recent window
        // the other rails read from — this one resolves through the search.
        searchTerms={["router"]}
        exploreHref="/products?search=router"
        tone="blue"
        frameClassName=""
      />
    </div>
  </div>
);

export default PromoTileBand;
