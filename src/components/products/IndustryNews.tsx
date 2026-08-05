import { useState } from "react"
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
  /** How many to show. Three fills the Figma's row. */
  limit?: number
}

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
 */
const IndustryNews = ({ items, limit = 3 }: IndustryNewsProps) => {
  const { data, isLoading } = useIndustryNews()

  const fromApi: NewsItem[] = (data ?? []).map((article) => ({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt ?? "",
    image: article.image ?? "",
    href: article.link ?? undefined,
  }))

  const list = (items?.length ? items : fromApi).slice(0, limit)

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="industry-news-heading">
      {/* x712 + 304/2 = 864, the column's midpoint — so it centres. */}
      <h2
        id="industry-news-heading"
        className="text-center text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Industry News &amp; Insights
      </h2>

      {list.length > 0 ? (
        <div className="mt-[23px] grid grid-cols-1 gap-[23px] sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="mt-[23px] text-center text-[12px] text-ink-body">
          {isLoading ? "Loading…" : "No data available."}
        </p>
      )}
    </section>
  )
}

export default IndustryNews
