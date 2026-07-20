import { ArrowRight } from "lucide-react"
import RatingStars from "./RatingStars"

interface ProductSummaryProps {
  name: string
  /** 0-5. The ERP sends no rating, so this is usually absent. */
  rating?: number
  /** The ERP sends no review count either. */
  reviews?: number
  /** `key_information` from the ERP — HTML, rendered as the spec bullets. */
  keyInformation?: string
  /** Scrolls to the detail tabs; the ERP carries no datasheet URL. */
  onViewDatasheet: () => void
}

const WARRANTY_TERM = "1 Year"

/**
 * Title, rating, spec bullets, warranty line and datasheet button — the middle
 * column of the Figma product frame, capped at its 389px measure.
 */
const ProductSummary = ({ name, rating, reviews, keyInformation, onViewDatasheet }: ProductSummaryProps) => {
  const hasReviews = typeof reviews === "number" && reviews > 0

  return (
    <div className="max-w-[389px]">
      <h1 className="text-[18px] font-semibold leading-[1.281] tracking-[-0.01em] text-ink-title">{name}</h1>

      <div className="mt-4 flex items-center gap-2">
        <RatingStars rating={hasReviews ? rating ?? 0 : 0} />
        <span className="text-[12px] text-ink-body">
          {hasReviews ? `${reviews} Reviews` : "No reviews yet"}
        </span>
      </div>

      <hr className="my-4 border-surface-muted" />

      {keyInformation && (
        <div
          className="product-key-info text-[13px] leading-[1.45] text-ink-body"
          dangerouslySetInnerHTML={{ __html: keyInformation }}
        />
      )}

      <hr className="my-4 border-surface-muted" />

      <p className="text-[13px] text-ink-body">
        Warranty : <span className="font-semibold text-ink-title">{WARRANTY_TERM}</span> Effortless warranty claims
        with global coverage
      </p>

      <button
        type="button"
        onClick={onViewDatasheet}
        className="mt-5 inline-flex h-[49px] items-center gap-[14px] rounded-lg bg-brand-700 px-5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        View Datasheet
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default ProductSummary
