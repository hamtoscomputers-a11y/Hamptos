import { useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useIndustryNews } from "@/api/hooks/useProducts"

export interface NewsItem {
  id: string | number
  title: string
  excerpt: string
  /** Bundled asset or absolute URL. Empty renders the grey panel instead. */
  image: string
  /** Optional destination; the card is inert without one. */
  href?: string
}

interface IndustryNewsProps {
  /** Overrides the ERP's cards. Used by stories and tests, not by the page. */
  items?: NewsItem[]
}

/** Cards visible at once on a wide screen — the Figma's row of three. */
const PER_VIEW = 3

/** 419 x 343 card: a 417 x 247 image inside a 1px #1A74BB border, then the copy. */
const NewsCard = ({ item }: { item: NewsItem }) => {
  const [hasImage, setHasImage] = useState(Boolean(item.image))

  const card = (
    <article className="flex h-[343px] flex-col overflow-hidden border border-brand-700 bg-white">
      {hasImage ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={() => setHasImage(false)}
          className="h-[247px] w-full flex-shrink-0 object-cover"
        />
      ) : (
        <div className="h-[247px] w-full flex-shrink-0 bg-surface-placeholder" aria-hidden />
      )}

      {/* 6px under the image — the card's vertical gap. */}
      <div className="mt-1.5 px-3">
        <h3 className="text-[14px] font-semibold leading-tight text-black">{item.title}</h3>
        {item.excerpt && (
          <p className="mt-1 line-clamp-3 text-[12px] leading-[1.42] text-black">{item.excerpt}</p>
        )}
      </div>
    </article>
  )

  if (!item.href) return card

  // Articles usually live elsewhere, so a new tab — with `noopener`, which stops
  // the opened page from reaching back into this one.
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-shadow hover:shadow-md"
    >
      {card}
    </a>
  )
}

/**
 * "Industry News & Insights", per the Figma's blocks:
 *
 *   heading  x712 — centred on the column — 28 / 28.9 / -2%  #000000
 *   row      1303 x 343 at x213, gap 23
 *   card     419 x 343, #FFFFFF on a 1px #1A74BB inside stroke, gap 6
 *   image    417 x 247 at 1,1 — flush inside the border
 *
 * Cards come from the ERP under Front End → Industry News, and are the same on
 * every product page. The section keeps its heading when there are none rather
 * than disappearing, so the page does not silently lose a block.
 *
 * Past three cards the row becomes a carousel with gutter arrows, the same one
 * the Related Products rail uses — so a fourth article is reachable rather than
 * silently dropped.
 */
const IndustryNews = ({ items }: IndustryNewsProps) => {
  const { data, isLoading } = useIndustryNews()

  const fromApi: NewsItem[] = (data ?? []).map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt ?? "",
    image: article.image ?? "",
    href: article.link ?? undefined,
  }))

  const list = items?.length ? items : fromApi
  const scrollable = list.length > PER_VIEW

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="industry-news-heading">
      {/* x712 + 304/2 = 864, the column's midpoint — so it centres. */}
      <h2
        id="industry-news-heading"
        className="text-center text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Industry News &amp; Insights
      </h2>

      {list.length === 0 ? null : scrollable ? (
        // 23px gutter, as the grid below — split across the two sides of each
        // slide so the outer edges stay flush with the column.
        <Carousel className="mt-[23px]" opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-[23px]">
            {list.map((item) => (
              <CarouselItem key={item.id} className="basis-full pl-[23px] sm:basis-1/2 lg:basis-1/3">
                <NewsCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Parked in the page margin at the widths where one exists, and
              tucked just inside the track below that — the same placement as
              the product rails. */}
          <CarouselPrevious
            className="left-1 hidden h-9 w-9 border-surface-arrow bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 sm:flex 2xl:-left-[57px] 2xl:bg-white 2xl:shadow-none"
            aria-label="Previous articles"
          />
          <CarouselNext
            className="right-1 hidden h-9 w-9 border-surface-arrow bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 sm:flex 2xl:-right-[57px] 2xl:bg-white 2xl:shadow-none"
            aria-label="More articles"
          />
        </Carousel>
      ) : (
        // Three or fewer fit the row, so no arrows and no drag — a static grid
        // reads as finished rather than as a rail that will not move.
        <div className="mt-[23px] grid grid-cols-1 gap-[23px] sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {list.length === 0 && (
        <p className="mt-[23px] text-center text-[12px] text-ink-body">
          {isLoading ? "Loading…" : "No data available."}
        </p>
      )}
    </section>
  )
}

export default IndustryNews
