import { useState } from "react"
import { Check, SquarePen } from "lucide-react"
import RatingStars from "./RatingStars"
import WriteReviewDialog from "./WriteReviewDialog"
import { useProductReviews } from "@/api/hooks/useProducts"
import type { ProductReviewSummary } from "@/api/types"

interface CustomerReviewsProps {
  /** Whose reviews to show. Without it the section renders its empty state. */
  productId?: string
  /** Named in the modal, so the reviewer can see what they are reviewing. */
  productName?: string
  /** Overrides the ERP's reviews. Used by stories and tests, not by the page. */
  reviews?: DisplayReview[]
}

/** One row of the list, in the shape this section draws. */
interface DisplayReview {
  id: string | number
  author: string
  /** Already formatted for display. */
  date: string
  rating: number
  body: string
  verified: boolean
}

const STAR_LEVELS = [5, 4, 3, 2, 1] as const

const EMPTY_SUMMARY: ProductReviewSummary = {
  average: null,
  total: 0,
  counts: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
}

/**
 * `4/25/26`, as the design writes it.
 *
 * The ERP sends `YYYY-MM-DD HH:MM:SS`, which Safari will not parse — hence the
 * split rather than `new Date(value)`. An unparseable value is shown as it
 * arrived instead of as "Invalid Date".
 */
const formatReviewDate = (value: string) => {
  const [datePart] = (value || "").split(" ")
  const [year, month, day] = datePart.split("-").map(Number)

  if (!year || !month || !day) {
    return value
  }

  return `${month}/${day}/${String(year).slice(-2)}`
}

/** Solid green disc with a white tick — the design's #34CF00 verified mark. */
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
 *
 * Reviews come from the ERP, which publishes only what has been approved under
 * Products → Customer Reviews. A product with none renders the empty state
 * rather than sample content — the section is on a live shop, and invented
 * reviews would read as real ones.
 */
const CustomerReviews = ({ productId, productName, reviews }: CustomerReviewsProps) => {
  const [writeOpen, setWriteOpen] = useState(false)
  const { data, isLoading } = useProductReviews(productId ?? "")

  const list: DisplayReview[] =
    reviews ??
    (data?.data ?? []).map((review) => ({
      id: review.id,
      author: review.author,
      date: formatReviewDate(review.created_at),
      rating: review.rating,
      // The headline stands in when someone rated without writing anything, so
      // the row is never a bare pair of dates and stars.
      body: review.body ?? review.title ?? "",
      verified: review.verified_buyer,
    }))

  // The counts span every approved review, while the list above is the newest
  // page of them — so a product with 44 reviews shows five and still says 44.
  const summary = reviews
    ? {
        average: list.length ? list.reduce((sum, review) => sum + review.rating, 0) / list.length : null,
        total: list.length,
        counts: Object.fromEntries(
          STAR_LEVELS.map((level) => [String(level), list.filter((review) => Math.round(review.rating) === level).length]),
        ) as ProductReviewSummary["counts"],
      }
    : (data?.summary ?? EMPTY_SUMMARY)

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="customer-reviews-heading">
      <div className="flex items-start justify-between gap-4">
        <h2
          id="customer-reviews-heading"
          className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
        >
          Customer Reviews
        </h2>

        {/* x1396 + 120 = 1516, the column's right edge — so it sits flush right.
            A button rather than a link: it opens the form in place instead of
            sending someone away from the product they are reviewing. */}
        <button
          type="button"
          onClick={() => setWriteOpen(true)}
          disabled={!productId}
          className="mt-1 flex flex-shrink-0 items-center gap-[5px] text-[14px] text-review-star hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SquarePen size={16} aria-hidden />
          Write a review
        </button>
      </div>

      {/* 30px under the heading. Rules top and bottom, nothing on the sides. */}
      <div className="mt-[30px] flex flex-col items-center gap-8 border-y border-black/50 py-6 lg:h-[175px] lg:flex-row lg:justify-center lg:gap-[104px] lg:py-0">
        <div className="flex-shrink-0 text-center">
          <p className="text-[28px] font-semibold leading-none text-black">
            {summary.average !== null ? summary.average.toFixed(1) : "—"}
          </p>
          <RatingStars
            rating={summary.average ?? 0}
            size={24}
            className="mt-2 justify-center"
            fillClass="text-review-star"
            emptyClass="text-surface-mist"
          />
          <p className="mt-2 text-[12px] text-black">
            ({summary.total} {summary.total === 1 ? "Review" : "Reviews"})
          </p>
        </div>

        <ul className="w-full max-w-[672px]">
          {STAR_LEVELS.map((level) => {
            const count = summary.counts[String(level) as keyof ProductReviewSummary["counts"]] ?? 0
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

      {list.length > 0 ? (
        <ul>
          {list.map((review) => (
            <li
              key={review.id}
              className="flex flex-col gap-4 border-b border-black/50 py-5 sm:flex-row sm:gap-[96px] lg:min-h-[120px] lg:py-[18px]"
            >
              <div className="w-[116px] flex-shrink-0">
                <p className="text-[12px] font-medium text-black">{review.author}</p>
                <p className="mt-1 text-[11px] text-review-meta">Posted on {review.date}</p>
                {/* Only where it was earned. The badge means the email given
                    matched a customer invoiced for this product, so showing it
                    on every row would make it mean nothing. */}
                {review.verified && (
                  <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-review-meta">
                    <VerifiedMark />
                    Verified Buyer
                  </p>
                )}
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
                {review.body && <p className="mt-2.5 text-[12px] leading-[1.4] text-black">{review.body}</p>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-b border-black/50 py-8 text-[13px] text-review-meta">
          {isLoading && productId ? "Loading reviews…" : "No reviews yet. Be the first to review this product."}
        </p>
      )}

      {productId && (
        <WriteReviewDialog
          open={writeOpen}
          onOpenChange={setWriteOpen}
          productId={productId}
          productName={productName}
        />
      )}
    </section>
  )
}

export default CustomerReviews
