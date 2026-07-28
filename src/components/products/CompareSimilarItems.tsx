import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useQueries } from "@tanstack/react-query"
import { ProductService } from "@/api/services/productService"
import { createSlug } from "@/lib/utils"
import { parseSpecGroups } from "./ProductSpecifications"

interface CompareSimilarItemsProps {
  /** Same-category products — the first choice for comparison columns. */
  products: any[]
  /** Catalogue-wide pool, used to top up when the category holds too few others. */
  fallbackProducts?: any[]
  /** Current product id, excluded so it is never its own comparator. */
  currentId: string
  /** The ERP product `code` — the current product's column header. */
  code: string
  name: string
  /** `key_information` from the ERP for the current product. */
  keyInformation?: string
}

/** The Figma compares the product against four others. */
const MAX_COMPARATORS = 4
/** The Figma lists four spec rows; past this the table stops being scannable. */
const MAX_SPEC_ROWS = 8

/** Flatten a `key_information` table into a label -> value lookup. */
const toSpecMap = (html?: string): Map<string, string> => {
  const map = new Map<string, string>()
  if (!html) return map
  for (const group of parseSpecGroups(html)) {
    for (const row of group.rows) if (!map.has(row.label)) map.set(row.label, row.value)
  }
  return map
}

/**
 * "Compare to Similar Items", per the Figma's 1304-wide block at x212: a caption
 * over a table whose first column names the spec and whose remaining columns are
 * one product each — this product in black, its comparators as brand-blue links.
 *
 * The comparators are live catalogue products, and every row is a spec label the
 * current product and at least one comparator both carry, so no cell is invented.
 * List endpoints omit `key_information`, so each comparator's full record is
 * fetched under the same query key `useProductById` uses — a shared cache, not a
 * second round of requests.
 */
const CompareSimilarItems = ({
  products,
  fallbackProducts = [],
  currentId,
  code,
  name,
  keyInformation,
}: CompareSimilarItemsProps) => {
  // Same-category products first, topped up from the catalogue pool.
  const comparators = useMemo(() => {
    const seen = new Set([currentId])
    const picked: any[] = []
    for (const pool of [products || [], fallbackProducts]) {
      for (const p of pool) {
        const id = String(p?.id ?? "")
        if (!id || seen.has(id)) continue
        seen.add(id)
        picked.push(p)
        if (picked.length >= MAX_COMPARATORS) break
      }
      if (picked.length >= MAX_COMPARATORS) break
    }
    return picked
  }, [products, fallbackProducts, currentId])

  const results = useQueries({
    queries: comparators.map((p) => ({
      // Same key shape as `useProductById`, so a visited product is already cached.
      queryKey: ["products", "id", String(p.id), "brand,category,photos"],
      queryFn: () => ProductService.getProductById(String(p.id), "brand,category,photos"),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const isLoading = results.some((r) => r.isLoading)

  const columns = useMemo(() => {
    const own = {
      id: currentId,
      code,
      name,
      slug: createSlug(name || currentId),
      specs: toSpecMap(keyInformation),
      isCurrent: true,
    }

    const others = results
      .map((result, index) => {
        const data = (result.data as any)?.data || result.data
        if (!data) return null
        const source = comparators[index]
        const label = data.code || source?.code || ""
        const productName = data.name || source?.name || ""
        return {
          id: String(data.id ?? source?.id ?? ""),
          code: label,
          name: productName,
          slug: createSlug(productName || String(data.id)),
          specs: toSpecMap(data.key_information),
          isCurrent: false,
        }
      })
      .filter(Boolean) as typeof own[]

    return [own, ...others]
  }, [currentId, code, name, keyInformation, results, comparators])

  // Only labels this product and at least one comparator both carry are
  // comparable; anything else would print a row of blanks.
  const specLabels = useMemo(() => {
    const own = columns[0]?.specs
    if (!own) return []
    const others = columns.slice(1)
    return [...own.keys()].filter((label) => others.some((column) => column.specs.has(label))).slice(0, MAX_SPEC_ROWS)
  }, [columns])

  if (isLoading || columns.length < 2 || !specLabels.length) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="compare-heading">
      <h2 id="compare-heading" className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">
        Compare to Similar Items
      </h2>

      <div className="mt-[30px]">
        <p className="text-[14px] font-light leading-[1.421] text-ink-slate">Table 3 shows the comparison.</p>

        <div className="mt-2.5 overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-[12px] leading-[15px] text-black">
            {/* 225 of the Figma's 1304 for the spec gutter; the product columns
                share what is left, five of 216 at the Figma's width. */}
            <colgroup>
              <col className="w-[17.3%]" />
              {columns.map((column) => (
                <col key={`col-${column.id}`} />
              ))}
            </colgroup>
            <tbody>
              <tr>
                <th scope="row" className="border border-surface-grid px-3 py-[11px] text-left align-top font-medium">
                  Product Name
                </th>
                {columns.map((column) => (
                  <td key={column.id} className="border border-surface-grid px-3 py-[11px] align-top">
                    {column.isCurrent ? (
                      column.code
                    ) : (
                      <Link
                        to={`/product/${column.slug}`}
                        state={{ productId: column.id }}
                        className="text-brand-700 hover:underline"
                      >
                        {column.code}
                      </Link>
                    )}
                  </td>
                ))}
              </tr>

              {specLabels.map((label) => (
                <tr key={label}>
                  <th scope="row" className="border border-surface-grid px-3 py-[11px] text-left align-top font-medium">
                    {label}
                  </th>
                  {columns.map((column) => (
                    <td
                      key={`${column.id}-${label}`}
                      className="whitespace-pre-line border border-surface-grid px-3 py-[11px] align-top"
                    >
                      {column.specs.get(label) ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default CompareSimilarItems
