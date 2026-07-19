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
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "key", label: "Key Information" },
  { key: "details", label: "Details" },
  { key: "specs", label: "Product Specifications" },
  { key: "reviews", label: "Reviews" },
]

/**
 * Detail tabs below the product summary, per the Figma's 1243 x 216 frame:
 * square chips in a row, the active one inverted to a pale blue fill.
 */
const ProductTabs = ({ active, onActiveChange, keyInformation, details, specifications }: ProductTabsProps) => {
  const content: Record<TabKey, string | undefined> = {
    key: keyInformation,
    details,
    specs: specifications,
    reviews: undefined,
  }

  const html = content[active]

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

      <div className="mt-[10px] min-h-[176px] py-4">
        {active === "reviews" ? (
          <p className="text-[13px] text-ink-body">No reviews yet. Be the first to review this product!</p>
        ) : html ? (
          <div
            className="product-key-info text-[13px] leading-[1.6] text-black"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="text-[13px] text-ink-body">No information available for this product.</p>
        )}
      </div>
    </div>
  )
}

export default ProductTabs
