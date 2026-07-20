import { useMemo } from "react"
import ProductSpecifications, { parseSpecGroups } from "./ProductSpecifications"
import ProductReviews, { type ProductReview } from "./ProductReviews"

export type TabKey = "key" | "details" | "specs" | "reviews"

interface ProductTabsProps {
  /** Controlled by the page so "View Datasheet" can open the specs tab. */
  active: TabKey
  onActiveChange: (tab: TabKey) => void
  /** `key_information` from the ERP — HTML. */
  keyInformation?: string
  /** `details` from the ERP — HTML. */
  details?: string
  /** `product_details` from the ERP — HTML. */
  specifications?: string
  /** The ERP exposes no review source yet, so this is empty in practice. */
  reviews?: ProductReview[]
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "key", label: "Key Information" },
  { key: "details", label: "Details" },
  { key: "specs", label: "Product Specifications" },
  { key: "reviews", label: "Reviews" },
]

/**
 * Detail tabs below the product summary, per the Figma's 905 x 670 frame:
 * a row of chips, the active one inverted to a pale blue fill, over a panel
 * holding whichever body of HTML the ERP sent for that tab.
 */
const ProductTabs = ({
  active,
  onActiveChange,
  keyInformation,
  details,
  specifications,
  reviews = [],
}: ProductTabsProps) => {
  const content: Record<TabKey, string | undefined> = {
    key: keyInformation,
    details,
    specs: specifications,
    reviews: undefined,
  }

  const html = content[active]

  // Only the specifications tab gets the grouped-table treatment; if the ERP
  // sent prose there instead, this comes back empty and the HTML path runs.
  const specGroups = useMemo(
    () => (active === "specs" && specifications ? parseSpecGroups(specifications) : []),
    [active, specifications],
  )

  return (
    <div className="mt-10">
      <div role="tablist" aria-label="Product information" className="flex flex-wrap gap-[3px]">
        {TABS.map((tab) => {
          const isActive = tab.key === active

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onActiveChange(tab.key)}
              className={`h-10 rounded px-3 text-[14px] transition-colors ${
                isActive ? "bg-surface-tab text-ink-midnight" : "bg-brand-900 text-white hover:bg-brand-800"
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* The Figma caps the panel rather than letting it run the full container
          width, which keeps the copy at a readable measure. Reviews get a wider
          frame than the text tabs to fit their two columns. */}
      <div className={`mt-[31px] min-h-[176px] ${active === "reviews" ? "max-w-[1198px]" : "max-w-[905px]"}`}>
        {active === "reviews" ? (
          <ProductReviews reviews={reviews} />
        ) : specGroups.length ? (
          <ProductSpecifications groups={specGroups} />
        ) : html ? (
          <div
            className="product-key-info text-[12px] leading-[1.4] text-ink-title"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-[12px] leading-[1.4] text-ink-body">No information available for this product.</p>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
