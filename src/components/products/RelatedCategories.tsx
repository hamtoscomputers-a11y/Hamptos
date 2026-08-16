import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useCategories, CATEGORY_TREE_PARAMS } from "@/api/hooks/useCategories"
import type { Category } from "@/api/types"

interface RelatedCategoriesProps {
  /** The product's own category id, from `products/view/{id}`. */
  categoryId?: string
  /** Its name, used only to keep the current category out of the row. */
  categoryName?: string
}

const MAX_ITEMS = 10

/**
 * "Related Categories" — the last section on the page, per the client's running
 * order.
 *
 * Nothing here is typed in the ERP. The row is the product's own siblings: the
 * other categories sitting under the same parent, or the top-level categories
 * when the product's category is itself top-level. That makes it correct on all
 * 430 products from the day it ships, and it stays correct as the catalogue is
 * reorganised, which a hand-maintained list per product would not.
 *
 * Reads the same frozen query arguments as the header and the home page rail,
 * so it shares their cache rather than opening a second request for a tree the
 * page has usually already fetched.
 */
const RelatedCategories = ({ categoryId, categoryName }: RelatedCategoriesProps) => {
  const { data, isLoading } = useCategories(CATEGORY_TREE_PARAMS)

  const tree: Category[] = Array.isArray(data?.data) ? data.data : []

  // Find where this product sits, so "related" means siblings rather than a
  // slice of the whole catalogue. Matched on id, with the name as a fallback:
  // the product endpoint and the tree endpoint have been seen to disagree on
  // the type of `id` (string against number), and a name match still lands on
  // the right branch when they do.
  const sameId = (a?: string | number, b?: string | number) =>
    a !== undefined && b !== undefined && String(a) === String(b)

  let siblings: Category[] = []

  for (const parent of tree) {
    const children = parent.children ?? []

    if (sameId(parent.id, categoryId) || (categoryName && parent.name === categoryName)) {
      // A top-level category: its peers are the other top-level ones.
      siblings = tree.filter((entry) => !sameId(entry.id, parent.id))
      break
    }

    if (children.some((child) => sameId(child.id, categoryId) || (categoryName && child.name === categoryName))) {
      siblings = children.filter(
        (child) => !sameId(child.id, categoryId) && !(categoryName && child.name === categoryName),
      )
      break
    }
  }

  // A category with no siblings — an only child, or one the tree does not carry
  // — falls back to the top level, which is still a useful place to go next.
  if (!siblings.length) {
    siblings = tree.filter((entry) => !sameId(entry.id, categoryId))
  }

  const categories = siblings.slice(0, MAX_ITEMS)

  if (isLoading || !categories.length) return null

  return (
    /* The only section on the page that needs its own bottom padding: it is the
       last one, and the newsletter panel below is full-bleed, so without it the
       chips sit hard against the blue. */
    <section className="container mx-auto px-4 pb-[50px] pt-[50px] sm:px-6 md:px-8" aria-label="Related Categories">
      <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">Related Categories</h2>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.id}`}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-surface-line bg-white px-4 py-2.5 text-[14px] text-ink-slate transition-colors hover:border-brand-700 hover:text-brand-700"
          >
            {category.name}
            <ChevronRight
              size={16}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedCategories
