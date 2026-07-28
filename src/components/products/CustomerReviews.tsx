import { Link } from "react-router-dom"
import { Check, SquarePen } from "lucide-react"
import RatingStars from "./RatingStars"
import type { ProductReview } from "./ProductReviews"

interface CustomerReviewsProps {
  /**
   * The ERP exposes no review source, so this is empty in practice and the
   * Figma's own sample content stands in. Pass real reviews and the summary,
   * the histogram and the list all derive from them instead.
   */
  reviews?: ProductReview[]
}

const STAR_LEVELS = [5, 4, 3, 2, 1]

/** The Figma's sample reviews, reproduced verbatim. Replaced by real data. */
const PLACEHOLDER_REVIEWS: ProductReview[] = [
  { id: 1, author: "John Doe", date: "4/25/26", rating: 4, body: "Works Perfectly" },
  {
    id: 2,
    author: "John Doe",
    date: "4/25/26",
    rating: 5,
    body: "We can choose the delivery company according to our address. Convenient.",
  },
  {
    id: 3,
    author: "John Doe",
    date: "4/25/26",
    rating: 5,
    body: "Your seller qupted price very fast. The price was also ok. Recommend it.",
  },
  {
    id: 4,
    author: "John Doe",
    date: "4/25/26",
    rating: 5,
    body: "Found this site through a Bing search, you have so many discount activities espicially in some special holiday, I have been concerned about you for a bit long time.",
  },
  { id: 5, author: "John Doe", date: "4/25/26", rating: 5, body: "Works Perfectly" },
]

/**
 * The Figma's summary counts 44 reviews while listing 5, so the placeholder
 * summary is carried separately rather than derived from the list above.
 */
const PLACEHOLDER_SUMMARY = { average: 4.8, total: 44, counts: [33, 11, 0, 0, 0] }

/** Solid green disc with a white tick — the Figma's #34CF00 verified mark. */
const VerifiedMark = () => (
  <span className="flex h-[13px] w-[13px] flex-shrink-0 items-center justify-center rounded-full bg-review-verified">
    <Check size={9} strokeWidth={3.5} className="text-white" aria-hidden />
  </span>
)

/**
 * "Customer Reviews", per the Figma's blocks at x212:
 *
 *   heading           28 / 28.9 / -2%  #000000, with "Write a review" at x1396
 *   summary  1304 x 175, gap 104, 1px #000000 at 50% top and bottom
 *   review   1303 x 120, gap 96,  1px #000000 at 50% underneath
 *
 * This section runs on its own palette: #0073ED stars and bars, #D9D9D9 tracks,
 * #DDDDDD empty stars, #8896A1 meta text, #34CF00 verified marks.
 */
const CustomerReviews = ({ reviews }: CustomerReviewsProps) => {
  const hasRealReviews = Boolean(reviews?.length)
  const list = hasRealReviews ? (reviews as ProductReview[]) : PLACEHOLDER_REVIEWS

  const summary = hasRealReviews
    ? {
        average: list.reduce((sum, review) => sum + review.rating, 0) / list.length,
        total: list.length,
        counts: STAR_LEVELS.map((level) => list.filter((review) => Math.round(review.rating) === level).length),
      }
    : PLACEHOLDER_SUMMARY

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="customer-reviews-heading">
      <div className="flex items-start justify-between gap-4">
        <h2
          id="customer-reviews-heading"
          className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
        >
          Customer Reviews
        </h2>

        {/* x1396 + 120 = 1516, the column's right edge — so it sits flush right. */}
        <Link
          to="/get-quote?source=write-a-review"
          className="mt-1 flex flex-shrink-0 items-center gap-[5px] text-[14px] text-review-star hover:underline"
        >
          <SquarePen size={16} aria-hidden />
          Write a review
        </Link>
      </div>

      {/* 30px under the heading. Rules top and bottom, nothing on the sides. */}
      <div className="mt-[30px] flex flex-col items-center gap-8 border-y border-black/50 py-6 lg:h-[175px] lg:flex-row lg:justify-center lg:gap-[104px] lg:py-0">
        <div className="flex-shrink-0 text-center">
          <p className="text-[28px] font-semibold leading-none text-black">{summary.average.toFixed(1)}</p>
          <RatingStars
            rating={summary.average}
            size={24}
            className="mt-2 justify-center"
            fillClass="text-review-star"
            emptyClass="text-surface-mist"
          />
          <p className="mt-2 text-[12px] text-black">({summary.total} Reviews)</p>
        </div>

        <ul className="w-full max-w-[672px]">
          {STAR_LEVELS.map((level, index) => {
            const count = summary.counts[index] ?? 0
            const share = summary.total ? (count / summary.total) * 100 : 0

            return (
              <li key={level} className="flex h-[21px] items-center gap-3 text-[12px] text-review-meta">
                <span className="w-[52px] flex-shrink-0">{level} Stars</span>
                <span className="h-[6px] flex-1 rounded-full bg-surface-line">
                  <span className="block h-full rounded-full bg-review-star" style={{ width: `${share}%` }} />
                </span>
                <span className="w-[24px] flex-shrink-0 text-right">{count}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <ul>
        {list.map((review) => (
          <li
            key={review.id}
            className="flex flex-col gap-4 border-b border-black/50 py-5 sm:flex-row sm:gap-[96px] lg:h-[120px] lg:py-[18px]"
          >
            <div className="w-[116px] flex-shrink-0">
              <p className="text-[12px] font-medium text-black">{review.author}</p>
              <p className="mt-1 text-[11px] text-review-meta">Posted on {review.date}</p>
              <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-review-meta">
                <VerifiedMark />
                Verified Buyer
              </p>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <RatingStars
                  rating={review.rating}
                  size={12}
                  fillClass="text-review-star"
                  emptyClass="text-surface-mist"
                />
                <span className="text-[12px] text-black">{review.rating.toFixed(1)}</span>
              </div>
              <p className="mt-2.5 text-[12px] leading-[1.4] text-black">{review.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default CustomerReviews
