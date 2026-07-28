import { useMemo } from "react"
import { Link } from "react-router-dom"
import { createSlug } from "@/lib/utils"

interface AccessoriesTableProps {
  /** Same-category products — the first choice to fill the table. */
  products: any[]
  /** Catalogue-wide pool, used to top up when the category holds too few others. */
  fallbackProducts?: any[]
  /** Current product id, excluded so the table never lists the page's own item. */
  currentId: string
  /** The ERP product `code` — used in the table caption. */
  code: string
  name: string
}

interface AccessoryRow {
  id: string
  code: string
  name: string
  slug: string
}

interface AccessoryGroup {
  title: string
  rows: AccessoryRow[]
}

/** The Figma lists five rows; more than this stops reading as a quick reference. */
const MAX_ROWS = 6

/**
 * "The Accessories", per the Figma's 1304-wide block at x212: a caption over a
 * table whose single-cell rows are group headings and whose two-cell rows pair
 * a brand-blue part code with its description.
 *
 * Both columns are live: the codes are ERP product `code`s linking to their own
 * pages, and the group headings are the ERP category each product sits in — the
 * only grouping the catalogue actually carries.
 */
const AccessoriesTable = ({ products, fallbackProducts = [], currentId, code, name }: AccessoriesTableProps) => {
  const groups = useMemo<AccessoryGroup[]>(() => {
    // Same-category products first, topped up from the catalogue pool.
    const seen = new Set([currentId])
    const picked: any[] = []
    for (const pool of [products || [], fallbackProducts]) {
      for (const p of pool) {
        const id = String(p?.id ?? "")
        if (!id || seen.has(id)) continue
        seen.add(id)
        picked.push(p)
        if (picked.length >= MAX_ROWS) break
      }
      if (picked.length >= MAX_ROWS) break
    }

    // Group by ERP category, preserving the order the products came back in.
    const byCategory = new Map<string, AccessoryRow[]>()
    for (const p of picked) {
      const category = (typeof p?.category === "object" ? p?.category?.name : p?.category) || "Other"
      const row: AccessoryRow = {
        id: String(p.id),
        code: p?.code || "",
        name: p?.name || "",
        slug: p?.name ? createSlug(p.name) : String(p.id),
      }
      const existing = byCategory.get(category)
      if (existing) existing.push(row)
      else byCategory.set(category, [row])
    }

    return [...byCategory.entries()].map(([title, rows]) => ({ title, rows }))
  }, [products, fallbackProducts, currentId])

  if (!groups.length) return null

  const caption = code ? `Table 2 shows the accessories of ${code}.` : `Table 2 shows the accessories of ${name}.`

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-labelledby="accessories-heading">
      <h2 id="accessories-heading" className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">
        The Accessories
      </h2>

      <div className="mt-[30px]">
        <p className="text-[14px] font-light leading-[1.421] text-ink-slate">{caption}</p>

        <div className="mt-2.5 overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-[12px] leading-[15px] text-black">
            {/* The first row is a colSpan-2 group heading, so `table-fixed` would
                split the table evenly off it. The colgroup pins the Figma's
                226-of-1304 part-code gutter regardless of which row leads. */}
            <colgroup>
              <col className="w-[17.3%]" />
              <col />
            </colgroup>
            <tbody>
              {groups.flatMap((group) => [
                <tr key={`group-${group.title}`}>
                  <th
                    scope="colgroup"
                    colSpan={2}
                    className="border border-surface-grid px-3 py-[11px] text-left align-top font-medium"
                  >
                    {group.title}
                  </th>
                </tr>,
                ...group.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-surface-grid px-3 py-[11px] align-top">
                      <Link
                        to={`/product/${row.slug}`}
                        state={{ productId: row.id }}
                        className="text-brand-700 hover:underline"
                      >
                        {row.code}
                      </Link>
                    </td>
                    <td className="border border-surface-grid px-2.5 py-[11px] align-top">{row.name}</td>
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AccessoriesTable
