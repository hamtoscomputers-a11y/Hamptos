import NewCollectionRail from "./NewCollectionRail";
import { isRouter } from "./productRanges";

const TITLE = "New Routers Collections";

/** 15px corners on every tile, over the `#D3D3D3` placeholder fill. */
const TILE = "block overflow-hidden rounded-[15px] bg-surface-tile";

/**
 * Row heights from the Figma, 250 and 244. Below `lg` the block stacks, so the
 * tiles take a banner aspect instead of a fixed height.
 */
const ROW_ONE = "aspect-[936/250] lg:aspect-auto lg:h-[250px]";
const ROW_TWO = "aspect-[440/244] lg:aspect-auto lg:h-[244px]";

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
      className="h-full w-full object-cover"
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
 * Slides are handed down rather than fetched here: the homepage already loads
 * `/website/slider` for the hero, and fetching it again would be a second
 * request for the same five rows.
 *
 * The tile block straddles the band's top edge: 180 of the upper row's 250 sits
 * on the white section above, the rest on the blue. That overlap only applies
 * from `lg` — once the tiles stack there is no second column to read it
 * against, so the band simply starts above them.
 */
const PromoTileBand = ({ slides, isLoading }: PromoTileBandProps) => (
  /* Not a landmark itself — the tile grid and the rail inside it are each
       labelled, and nesting a third region with the rail's own name makes the
       page announce it twice. */
  /* `flex` is load-bearing: without it the tile block's negative top margin
       collapses through this element and drags the blue up with it, so the
       band starts level with the tiles instead of 180 below their top. */
  <div className="mt-12 flex flex-col bg-brand-700 lg:mt-[256px]">
    <section
      aria-label="Promotional banners"
      className="container mx-auto px-4"
    >
      <div className="space-y-[22px] lg:-mt-[180px]">
        {/* 936 | 348 */}
        <div className="grid gap-4 lg:grid-cols-[936fr_348fr]">
          <PromoTile
            slide={slides[0]}
            isLoading={isLoading}
            className={ROW_ONE}
          />
          <PromoTile
            slide={slides[1]}
            isLoading={isLoading}
            className={ROW_ONE}
          />
        </div>

        {/* 344 | 440 | 484 */}
        <div className="grid gap-4 lg:grid-cols-[344fr_440fr_484fr]">
          <PromoTile
            slide={slides[2]}
            isLoading={isLoading}
            className={ROW_TWO}
          />
          <PromoTile
            slide={slides[3]}
            isLoading={isLoading}
            className={ROW_TWO}
          />
          <PromoTile
            slide={slides[4]}
            isLoading={isLoading}
            className={ROW_TWO}
          />
        </div>
      </div>
    </section>

    {/* 130 between the tiles and the rail, 114 of blue below it — measured
          off the Figma, where the band ends 114 under the cards and the banner
          follows 79 later. */}
    <div className="pb-[114px] pt-[130px]">
      <NewCollectionRail
        title={TITLE}
        match={isRouter}
        // Routers are all older stock, so none fall inside the recent window
        // the other rails read from — this one resolves through the search.
        searchTerm="router"
        exploreHref="/products?search=router"
        tone="blue"
        frameClassName=""
      />
    </div>
  </div>
);

export default PromoTileBand;
