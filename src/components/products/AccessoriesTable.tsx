import { Link } from "react-router-dom"
import { createSlug } from "@/lib/utils"
import { useProductAccessories } from "@/api/hooks/useProducts"

interface AccessoriesTableProps {
  /** Current product id — the accessory groups are looked up against it. */
  currentId: string
  /** The ERP product `code` — used in the table caption. */
  code: string
  name: string
}

/**
 * "The Accessories", per the Figma's 1304-wide block at x212: a caption over a
 * table whose single-cell rows are group headings and whose two-cell rows pair
 * a brand-blue part code with its description.
 *
 * The same curated data as the bundle rail higher up the page, laid out as a
 * reference table instead of cards — the group headings are the admin's own
 * names ("Mount Kit", "Power Adaptor") and the codes are ERP product `code`s
 * linking to their own pages.
 */
const AccessoriesTable = ({ currentId, code, name }: AccessoriesTableProps) => {
  const { data, isLoading } = useProductAccessories(currentId)
  const groups = data ?? []

  if (isLoading || !groups.length) return null


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
                <tr key={`group-${group.name}`}>
                  <th
                    scope="colgroup"
                    colSpan={2}
                    className="border border-surface-grid px-3 py-[11px] text-left align-top font-medium"
                  >
                    {group.name}
                  </th>
                </tr>,
                ...group.products.map((product) => (
                  <tr key={product.id}>
                    <td className="border border-surface-grid px-3 py-[11px] align-top">
                      <Link
                        to={`/product/${product.slug || createSlug(product.name)}`}
                        state={{ productId: product.id }}
                        className="text-brand-700 hover:underline"
                      >
                        {product.code}
                      </Link>
                    </td>
                    <td className="border border-surface-grid px-2.5 py-[11px] align-top">{product.name}</td>
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
