import { User } from "lucide-react"
import RatingStars from "./RatingStars"

export interface ProductReview {
  id: string | number
  author: string
  /** Rendered as sent, so the source decides the format. */
  date: string
  /** 0-5. */
  rating: number
  body: string
}

const STAR_LEVELS = [5, 4, 3, 2, 1]

/**
 * The Reviews tab, per the Figma's 1198 x 572 frame: a rating summary in a
 * 393px column beside the review list. Averages and bar lengths are derived
 * from `reviews`, so an empty list yields the empty state rather than zeroes.
 */
const ProductReviews = ({ reviews }: { reviews: ProductReview[] }) => {
  if (!reviews.length) {
    return <p className="text-[12px] leading-[1.4] text-ink-body">No reviews yet. Be the first to review this product!</p>
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const counts = STAR_LEVELS.map((level) => reviews.filter((review) => Math.round(review.rating) === level).length)

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[393px_minmax(0,1fr)] lg:gap-x-[71px]">
      <section aria-label="Rating summary">
        <div className="flex items-center gap-10">
          <RatingStars rating={average} size={22} />
          <p className="text-[16px] text-black">{average.toFixed(1)} out of 5</p>
        </div>

        <ul className="mt-[34px]">
          {STAR_LEVELS.map((level, index) => (
            <li key={level} className="flex h-[35px] max-w-[393px] items-center text-[13px] text-ink-coal">
              <span className="w-[70px] flex-shrink-0">{level} Stars</span>
              <span className="h-3 flex-1 rounded-full bg-surface-line">
                {/* Share of all reviews. The Figma's own bar lengths aren't
                    proportional to the counts printed beside them, so they set
                    the styling here rather than the scale. */}
                <span
                  className="block h-full rounded-full bg-star"
                  style={{ width: `${Math.max((counts[index] / reviews.length) * 100, counts[index] ? 2 : 0)}%` }}
                />
              </span>
              <span className="w-[31px] flex-shrink-0 text-right">{counts[index]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="User reviews">
        <h3 className="text-[16px] font-semibold text-black">User Reviews</h3>

        <ul className="mt-[37px] space-y-5">
          {reviews.map((review) => (
            <li key={review.id}>
              <div className="flex items-start gap-[21px]">
                <span className="flex h-[59px] w-[59px] flex-shrink-0 items-center justify-center bg-surface-line">
                  <User className="h-8 w-8 text-surface" fill="currentColor" strokeWidth={0} />
                </span>
                <div className="pt-2">
                  <RatingStars rating={review.rating} size={11} />
                  <p className="mt-[14px] text-[14px] text-black">
                    By {review.author} | {review.date}
                  </p>
                </div>
              </div>
              <p className="mt-[14px] text-[15px] leading-[20px] text-black">{review.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default ProductReviews
