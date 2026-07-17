import { useState } from "react"
import { ChevronRight, Package } from "lucide-react"
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
    return <div className="p-6 text-center text-sm text-gray-500">Loading categories...</div>
  }

  if (error) {
    return <div className="bg-red-50 p-6 text-center text-sm text-red-500">Failed to load categories</div>
  }

  return (
    <div className="custom-scrollbar max-h-[70vh] overflow-y-auto">
      {categories.map((category) => {
        const children = category.children ?? []
        const hasChildren = children.length > 0
        const isExpanded = expandedId === category.id

        return (
          <div key={category.id} className="border-b border-gray-100 last:border-b-0">
            <div className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50">
              <Link
                to={`/products?category=${category.id}`}
                className="group flex flex-1 items-center gap-2"
                onClick={onNavigate}
              >
                <Package size={16} className="flex-shrink-0 text-brand-700" aria-hidden />
                <span className="text-sm font-medium text-brand-950 transition-colors group-hover:text-brand-700">
                  {category.name}
                </span>
              </Link>

              {hasChildren && (
                <button
                  type="button"
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
                  aria-expanded={isExpanded}
                  onClick={() => setExpandedId(isExpanded ? null : category.id)}
                  className="p-1 text-gray-400 hover:text-brand-700"
                >
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    aria-hidden
                  />
                </button>
              )}
            </div>

            {hasChildren && isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50 py-2">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    to={`/products?category=${category.id}&parent_id=${child.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-brand-700 hover:text-white"
                    onClick={onNavigate}
                  >
                    <ChevronRight size={12} className="flex-shrink-0 opacity-60" aria-hidden />
                    <span>{child.name}</span>
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
