import { useState } from "react"
import newsOne from "@/assets/news-1.png"
import newsTwo from "@/assets/news-2.png"
import newsThree from "@/assets/news-3.png"

export interface NewsItem {
  id: string | number
  title: string
  excerpt: string
  /** Bundled asset or absolute URL. */
  image: string
  /** Optional destination; the card is inert without one. */
  href?: string
}

interface IndustryNewsProps {
  /**
   * The ERP has no news, blog or article endpoint, so this is empty in practice
   * and the placeholders below stand in. Pass real items and they render instead.
   */
  items?: NewsItem[]
}

/** The Figma's own copy and artwork, both verbatim. Replaced by real items. */
const PLACEHOLDER_EXCERPT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut"

const PLACEHOLDER_ITEMS: NewsItem[] = [
  { id: 1, title: "Lorem Ipsum", excerpt: PLACEHOLDER_EXCERPT, image: newsOne },
  { id: 2, title: "Lorem Ipsum", excerpt: PLACEHOLDER_EXCERPT, image: newsTwo },
  { id: 3, title: "Lorem Ipsum", excerpt: PLACEHOLDER_EXCERPT, image: newsThree },
]

/** 419 x 343 card: a 417 x 247 image inside a 1px #1A74BB border, then the copy. */
const NewsCard = ({ item }: { item: NewsItem }) => {
  const [hasImage, setHasImage] = useState(true)

  return (
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
        <p className="mt-1 line-clamp-3 text-[12px] leading-[1.42] text-black">{item.excerpt}</p>
      </div>
    </article>
  )
}

/**
 * "Industry News & Insights", per the Figma's blocks:
 *
 *   heading  x712 — centred on the column — 28 / 28.9 / -2%  #000000
 *   row      1303 x 343 at x213, gap 23
 *   card     419 x 343, #FFFFFF on a 1px #1A74BB inside stroke, gap 6
 *   image    417 x 247 at 1,1 — flush inside the border
 */
const IndustryNews = ({ items }: IndustryNewsProps) => {
  const list = items?.length ? items : PLACEHOLDER_ITEMS

  if (!list.length) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="industry-news-heading">
      {/* x712 + 304/2 = 864, the column's midpoint — so it centres. */}
      <h2
        id="industry-news-heading"
        className="text-center text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Industry News &amp; Insights
      </h2>

      <div className="mt-[23px] grid grid-cols-1 gap-[23px] sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  )
}

export default IndustryNews
