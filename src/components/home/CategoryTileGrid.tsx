import { useState } from "react"
import { Link } from "react-router-dom"
import { iconForCategory } from "./categoryIcons"

export interface CategoryTile {
  id: string
  name: string
  image?: string
  /** Where the tile links. Defaults to the top-level category listing. */
  href?: string
}

interface CategoryTileGridProps {
  title: string
  subtitle: string
  categories: CategoryTile[]
  isLoading?: boolean
}

const SKELETON_COUNT = 8

/**
 * The ERP returns a sentinel placeholder rather than an empty field when a
 * category has no artwork, so it has to be filtered out by name — otherwise
 * every imageless category renders the same "no image" graphic.
 */
const isRealImage = (image?: string) => !!image && !/no_image/i.test(image)

/**
 * Tile artwork: the ERP image when there is one, otherwise the category's own
 * line icon — the same mapping the icon rail uses, so an imageless category
 * still reads as itself rather than as a generic placeholder. Also covers an
 * image that 404s at runtime.
 */
const CategoryArtwork = ({ category }: { category: CategoryTile }) => {
  const [failed, setFailed] = useState(false)
  const showImage = isRealImage(category.image) && !failed

  if (showImage) {
    return (
      <img
        src={category.image}
        alt=""
        aria-hidden
        loading="lazy"
        className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    )
  }

  const Icon = iconForCategory(category.name)
  return (
    <Icon
      size={64}
      strokeWidth={1}
      aria-hidden
      className="text-ink-steel transition-transform duration-300 group-hover:scale-105 group-hover:text-brand-700"
    />
  )
}

/** Four-up grid of category tiles. Shared by the top-level and sub category sections. */
const CategoryTileGrid = ({ title, subtitle, categories, isLoading = false }: CategoryTileGridProps) => {
  if (!isLoading && categories.length === 0) return null

  return (
    <section aria-label={title} className="bg-white py-12">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold text-brand-700">{title}</h2>
          <p className="mt-2 text-sm text-ink">{subtitle}</p>
        </header>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {isLoading
            ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-xl border border-surface-muted p-4">
                  <div className="aspect-[4/3] rounded-lg bg-gray-100" />
                  <div className="mx-auto mt-4 h-4 w-24 rounded bg-gray-100" />
                </div>
              ))
            : categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.href ?? `/products?category=${category.id}`}
                  className="group flex flex-col rounded-xl border border-surface-muted bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden">
                    <CategoryArtwork category={category} />
                  </div>

                  <h3 className="mt-4 text-center text-sm font-semibold text-ink group-hover:text-brand-700">
                    {category.name}
                  </h3>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryTileGrid
