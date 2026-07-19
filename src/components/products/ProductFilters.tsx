import { useState, type ReactNode } from "react"
import { ChevronRight, Minus, Plus } from "lucide-react"

interface Option {
  id: string
  name: string
}

interface ProductFiltersProps {
  categories: Option[]
  subcategories: Option[]
  brands: (Option & { code: string })[]
  category: string
  subcategory: string
  brand: string
  priceMin: string
  priceMax: string
  includeOutOfStock: boolean
  onCategoryChange: (id: string) => void
  onSubcategoryChange: (id: string) => void
  onBrandChange: (code: string) => void
  onPriceMinChange: (value: string) => void
  onPriceMaxChange: (value: string) => void
  onPriceCommit: () => void
  onIncludeOutOfStockChange: (next: boolean) => void
}

/**
 * A sidebar section. `collapsible` is omitted for the sections the Figma shows
 * without a collapse chip (Price, Out of Stock), which then always render open.
 */
const Section = ({
  title,
  children,
  collapsible = false,
}: {
  title: string
  children: ReactNode
  collapsible?: boolean
}) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="border-b border-surface-muted pb-[15px] last:border-b-0 last:pb-0">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-ink-deep">{title}</h3>

        {collapsible && (
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
            className="flex h-[18px] w-6 items-center justify-center rounded-[3px] bg-surface-chip text-brand-900 transition-opacity hover:opacity-80"
          >
            {open ? <Minus size={12} aria-hidden /> : <Plus size={12} aria-hidden />}
          </button>
        )}
      </div>

      {open && children}
    </div>
  )
}

/** Square outline checkbox, sized to the Figma's option rows. */
const CheckOption = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
}) => (
  <label className="flex cursor-pointer items-center gap-2 text-[11px] text-ink-body">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="h-3 w-3 cursor-pointer rounded-[2px] border-ink-grey/60 text-brand-900 focus:ring-1 focus:ring-brand-700"
    />
    {label}
  </label>
)

/** Filter rail for the category / all-products listing, per the Figma sidebar frame. */
const ProductFilters = ({
  categories,
  subcategories,
  brands,
  category,
  subcategory,
  brand,
  priceMin,
  priceMax,
  includeOutOfStock,
  onCategoryChange,
  onSubcategoryChange,
  onBrandChange,
  onPriceMinChange,
  onPriceMaxChange,
  onPriceCommit,
  onIncludeOutOfStockChange,
}: ProductFiltersProps) => (
  <div className="flex flex-col gap-[15px]">
    <Section title="Category" collapsible>
      <ul className="space-y-1.5">
        {categories.map((item) => {
          const isActive = category === item.id

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onCategoryChange(isActive ? "" : item.id)}
                aria-pressed={isActive}
                className={`flex w-full items-center justify-between gap-2 text-left text-[11px] transition-colors hover:text-brand-900 ${
                  isActive ? "font-semibold text-brand-900" : "text-ink-body"
                }`}
              >
                <span className="truncate">{item.name}</span>
                {isActive && subcategories.length > 0 && (
                  <ChevronRight size={14} className="flex-shrink-0" aria-hidden />
                )}
              </button>

              {/* The Figma nests children under the open category. */}
              {isActive && subcategories.length > 0 && (
                <ul className="mt-1.5 space-y-1.5 pl-3">
                  {subcategories.map((sub) => (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => onSubcategoryChange(subcategory === sub.id ? "" : sub.id)}
                        aria-pressed={subcategory === sub.id}
                        className={`text-left text-[11px] transition-colors hover:text-brand-900 ${
                          subcategory === sub.id ? "font-semibold text-brand-900" : "text-ink-grey"
                        }`}
                      >
                        {sub.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </Section>

    <Section title="Brands" collapsible>
      <div className="space-y-1.5">
        {brands.map((item) => (
          <CheckOption
            key={item.id}
            label={item.name}
            checked={brand === item.code}
            onChange={(next) => onBrandChange(next ? item.code : "")}
          />
        ))}
      </div>
    </Section>

    <Section title="Price (AED)">
      <div className="flex items-center gap-2.5">
        <input
          type="number"
          inputMode="numeric"
          aria-label="Minimum price"
          value={priceMin}
          onChange={(event) => onPriceMinChange(event.target.value)}
          onBlur={onPriceCommit}
          className="w-[52px] rounded-[3px] border border-surface-muted px-1.5 py-1 text-center text-[11px] text-ink-body focus:outline-none focus:ring-1 focus:ring-brand-700"
        />
        <span className="flex-shrink-0 text-[11px] text-ink-body">To</span>
        <input
          type="number"
          inputMode="numeric"
          aria-label="Maximum price"
          value={priceMax}
          onChange={(event) => onPriceMaxChange(event.target.value)}
          onBlur={onPriceCommit}
          className="w-[52px] rounded-[3px] border border-surface-muted px-1.5 py-1 text-center text-[11px] text-ink-body focus:outline-none focus:ring-1 focus:ring-brand-700"
        />
      </div>
    </Section>

    <Section title="Out of Stock">
      <CheckOption
        label="Include Out of Stock"
        checked={includeOutOfStock}
        onChange={onIncludeOutOfStockChange}
      />
    </Section>
  </div>
)

export default ProductFilters
