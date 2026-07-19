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
    return <div className="p-6 text-center text-sm text-white/70">Loading categories...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-sm text-white">Failed to load categories</div>
  }

  return (
    <div className="dark-scrollbar h-[264px] overflow-y-auto">
      {categories.map((category) => {
        const children = category.children ?? []
        const hasChildren = children.length > 0
        const isExpanded = expandedId === category.id

        return (
          <div key={category.id} className="border-b border-surface-line/[0.13] last:border-b-0">
            {/* Selection colors in the Figma are FFFFFF/004672 — hover inverts the row. */}
            <div className="group flex items-center transition-colors hover:bg-white">
              <Link
                to={`/products?category=${category.id}`}
                className="flex-1 py-1 pl-4 text-[13px] text-white transition-colors group-hover:text-ink-navy"
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
                  className="px-3 py-1 text-white transition-colors group-hover:text-ink-navy"
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
                  className="px-3 py-1 text-white transition-colors group-hover:text-ink-navy"
                  onClick={onNavigate}
                >
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="border-t border-surface-line/[0.13] bg-black/15">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/products?category=${category.id}&parent_id=${child.id}`}
                    className="block py-2 pl-8 pr-4 text-[13px] text-white/85 transition-colors hover:bg-white hover:text-ink-navy"
                    onClick={onNavigate}
                  >
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
