import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface AllCategoriesMenuProps {
  categories: Category[]
  isLoading: boolean
  error: unknown
  onNavigate: () => void
}

/** Dropdown panel listing live catalogue categories and their children. */
const AllCategoriesMenu = ({ categories, isLoading, error, onNavigate }: AllCategoriesMenuProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-ink-grey">Loading categories...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-sm text-ink-body">Failed to load categories</div>
  }

  return (
    /* Grows to the list rather than sitting in a fixed window, and only starts
       scrolling once it would run past the fold — the original behaviour. */
    <div className="scrollbar-hidden max-h-[70vh] overflow-y-auto">
      {categories.map((category) => {
        const children = category.children ?? []
        const hasChildren = children.length > 0
        const isExpanded = expandedId === category.id

        return (
          <div key={category.id} className="border-b border-surface-line/60 last:border-b-0">
            {/* Roomy rows on a hairline grid. Colours come from the nav bar —
                black labels going blue on hover, like the links beside
                "All Categories". */}
            <div className="group flex items-center transition-colors hover:bg-surface-accent">
              <Link
                to={`/products?category=${category.id}`}
                className="flex-1 py-3 pl-4 text-sm font-medium text-black transition-colors group-hover:text-brand-700"
                onClick={onNavigate}
              >
                {category.name}
              </Link>

              {hasChildren ? (
                <button
                  type="button"
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? null : category.id)}
                  className="px-4 py-3 text-ink-grey transition-colors group-hover:text-brand-700"
                >
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    aria-hidden
                  />
                </button>
              ) : (
                /* Keeps the row rhythm of the design; the chevron reads as "go to category". */
                <Link
                  to={`/products?category=${category.id}`}
                  tabIndex={-1}
                  aria-hidden
                  className="px-4 py-3 text-ink-grey transition-colors group-hover:text-brand-700"
                  onClick={onNavigate}
                >
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="border-t border-surface-line/60 bg-surface-subtle py-2">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/products?category=${category.id}&parent_id=${child.id}`}
                    className="group/child flex items-center gap-2 px-4 py-2.5 text-sm text-ink-body transition-colors hover:bg-brand-700 hover:text-white"
                    onClick={onNavigate}
                  >
                    <ChevronRight
                      size={12}
                      className="flex-shrink-0 text-ink-grey group-hover/child:text-white"
                      aria-hidden
                    />
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AllCategoriesMenu
