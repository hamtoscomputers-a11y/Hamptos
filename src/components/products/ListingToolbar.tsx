import { Link } from "react-router-dom"

/** Sort options, each backed by a field the ERP actually returns. */
export const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]["value"]

interface ListingToolbarProps {
  /** Index of the first item shown, 1-based. */
  rangeStart: number
  /** Index of the last item shown. */
  rangeEnd: number
  total: number
  /** Trailing breadcrumb crumb — the active category or brand. Omitted when browsing everything. */
  crumb?: string
  sort: SortValue
  onSortChange: (value: SortValue) => void
}

/**
 * Row above the product grid: result range + breadcrumb on the left, sort on the
 * right, per the Figma's 57px toolbar frame.
 */
const ListingToolbar = ({ rangeStart, rangeEnd, total, crumb, sort, onSortChange }: ListingToolbarProps) => (
  <div className="flex h-[57px] flex-wrap items-center justify-between gap-[15px] border-b border-surface-muted">
    <p className="text-[13px] text-ink-charcoal">
      {total > 0 ? `${rangeStart}-${rangeEnd} of ${total}` : "0 results"}{" "}
      <span className="text-ink-slate">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {crumb && ` > ${crumb}`}
      </span>
    </p>

    <label className="flex items-center gap-2 text-[13px] text-ink-charcoal">
      Sort By
      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value as SortValue)}
        className="h-8 rounded-[3px] border border-surface-muted bg-white px-2 text-[13px] text-ink-slate focus:outline-none focus:ring-1 focus:ring-brand-700"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  </div>
)

export default ListingToolbar
