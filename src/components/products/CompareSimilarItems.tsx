import { useMemo } from "react"
import { Link } from "react-router-dom"
import { createSlug } from "@/lib/utils"
import { useProductComparisons } from "@/api/hooks/useProducts"
import { parseSpecGroups } from "./ProductSpecifications"

interface CompareSimilarItemsProps {
  /** Current product id — the comparators are looked up against it. */
  currentId: string
  /** The ERP product `code` — the current product's column header. */
  code: string
  name: string
  /** `key_information` from the ERP for the current product. */
  keyInformation?: string
}

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
 * The comparators are chosen in the ERP under Products → Accessories, so the
 * table compares what someone decided was worth comparing. Every row is a spec
 * label the current product and at least one comparator both carry, so no cell
 * is invented. The API sends each comparator's `key_information` with the list,
 * so the columns cost one request rather than one per product.
 */
const CompareSimilarItems = ({ currentId, code, name, keyInformation }: CompareSimilarItemsProps) => {
  const { data, isLoading } = useProductComparisons(currentId)
  const comparators = data ?? []

  const columns = useMemo(() => {
    const own = {
      id: currentId,
      code,
      name,
      slug: createSlug(name || currentId),
      specs: toSpecMap(keyInformation),
      isCurrent: true,
    }

    const others = comparators.map((product) => ({
      id: String(product.id),
      code: product.code || "",
      name: product.name || "",
      slug: product.slug || createSlug(product.name || String(product.id)),
      specs: toSpecMap(product.key_information),
      isCurrent: false,
    }))

    return [own, ...others]
  }, [currentId, code, name, keyInformation, comparators])

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
          <table className="w-full min-w-[560px] table-fixed border-collapse text-[12px] leading-[15px] text-black">
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
                <th scope="row" className="break-words border border-surface-grid px-2 py-[11px] text-left align-top font-medium md:px-3">
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
                  <th scope="row" className="break-words border border-surface-grid px-2 py-[11px] text-left align-top font-medium md:px-3">
                    {label}
                  </th>
                  {columns.map((column) => (
                    <td
                      key={`${column.id}-${label}`}
                      className="break-words whitespace-pre-line border border-surface-grid px-2 py-[11px] align-top md:px-3"
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
