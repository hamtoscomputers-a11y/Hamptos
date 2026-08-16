import { Link } from "react-router-dom"
import { LayoutGrid } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
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
    /* No top padding, unlike every other section on this page. The Related
       Products rail directly above is the one section that carries its own
       `py-12`, so a `pt-[50px]` here stacked on that 48px and opened a 98px
       hole where the rest of the page runs at 50.
       Bottom padding it does need: it is the last section, and the newsletter
       panel below is full-bleed, so without it the cards sit hard against the
       blue. */
    <section className="container mx-auto px-4 pb-[50px] sm:px-6 md:px-8" aria-label="Related Categories">
      <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">Related Categories</h2>

      {/* Five-up, matching the Related Products rail directly above so the two
          read as a pair rather than two different ideas about what a row of
          links looks like. Arrows sit in the page margin at the widths where
          that margin exists, and overlap the track below them. */}
      <div className="mt-5">
        <Carousel opts={{ align: "start", loop: false }}>
          <CarouselContent className="-ml-[15px]">
            {categories.map((category) => (
              <CarouselItem key={category.id} className="basis-1/2 pl-[15px] md:basis-1/3 lg:basis-1/5">
                <Link
                  to={`/products?category=${category.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-surface-line bg-white transition-shadow hover:shadow-sm"
                >
                  {/* Same 247x169 well the product cards use, so this rail and
                      the Related Products rail above it line up rather than
                      stepping against each other. */}
                  <span className="relative flex aspect-[247/169] w-full items-center justify-center overflow-hidden bg-surface-line">
                    {/* Most categories have no artwork uploaded yet — 3 of 12
                        at the time of writing. A bare tint reads as an image
                        that failed to load, so an imageless tile draws a mark
                        instead and looks deliberate until the artwork lands. */}
                    <LayoutGrid size={30} className="text-ink-steel/35" aria-hidden />
                    {category.image && (
                      <img
                        src={category.image}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        onError={(event) => {
                          event.currentTarget.style.visibility = "hidden"
                        }}
                      />
                    )}
                  </span>

                  <span className="block px-5 py-4 text-[14px] font-medium leading-[20px] text-ink-jet transition-colors group-hover:text-brand-700">
                    {category.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Parked clear of the track at 2xl, where the page has margin to put
              them in; below that they overlap the image well rather than the
              name, which is where the product rail puts them too. */}
          <CarouselPrevious className="left-1 top-[38%] hidden h-9 w-9 -translate-y-1/2 border-surface-arrow bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 sm:flex 2xl:-left-[57px] 2xl:top-1/2 2xl:bg-white 2xl:shadow-none" />
          <CarouselNext className="right-1 top-[38%] hidden h-9 w-9 -translate-y-1/2 border-surface-arrow bg-white/90 text-ink-steel shadow-sm hover:bg-brand-100 hover:text-brand-700 sm:flex 2xl:-right-[57px] 2xl:top-1/2 2xl:bg-white 2xl:shadow-none" />
        </Carousel>
      </div>
    </section>
  )
}

export default RelatedCategories
