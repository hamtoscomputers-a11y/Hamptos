import { Link } from "react-router-dom"
import { iconForCategory } from "./categoryIcons"

interface RailCategory {
  id: string
  name: string
}

interface CategoryIconRailProps {
  categories: RailCategory[]
  isLoading: boolean
  error: unknown
}

const SKELETON_COUNT = 9

/**
 * Horizontal icon rail beneath the hero, linking into the live catalogue.
 *
 * Categories come from the API, so the rail always reflects the real
 * catalogue; each name is mapped onto a line icon (see `categoryIcons`).
 */
const CategoryIconRail = ({ categories, isLoading, error }: CategoryIconRailProps) => {
  // The header's All Categories menu is the fallback path, so a failed rail
  // stays silent rather than pushing an error banner into the hero area.
  if (error) return null

  return (
    <section aria-label="Shop by category" className="bg-white">
      <div className="container mx-auto px-4">
        <div className="custom-scrollbar overflow-x-auto py-5">
          <ul className="flex min-w-max items-start justify-center gap-2 sm:gap-4">
            {isLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <li key={index} className="w-28 flex-shrink-0 animate-pulse text-center">
                    <div className="mx-auto h-10 w-10 rounded-full bg-gray-200" />
                    <div className="mx-auto mt-3 h-3 w-16 rounded bg-gray-200" />
                  </li>
                ))
              : categories.map((category) => {
                  const Icon = iconForCategory(category.name)

                  return (
                    <li key={category.id} className="w-28 flex-shrink-0">
                      <Link
                        to={`/products?category=${category.id}`}
                        className="group flex flex-col items-center gap-3 rounded-lg px-2 py-3 text-center transition-colors hover:bg-surface-accent"
                      >
                        <Icon
                          size={36}
                          strokeWidth={1.25}
                          className="text-brand-950 transition-colors group-hover:text-brand-700"
                          aria-hidden
                        />
                        <span className="text-xs font-medium capitalize text-brand-950 transition-colors group-hover:text-brand-700">
                          {category.name.toLowerCase()}
                        </span>
                      </Link>
                    </li>
                  )
                })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default CategoryIconRail
