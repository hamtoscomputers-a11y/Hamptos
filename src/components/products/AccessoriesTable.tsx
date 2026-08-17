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

        {/* Same as Quick Specs: the Figma's 17.3% code gutter is ~60px on a
            phone, so an 8-digit part code sits on the divider. Widen it until
            `md` and wrap long names instead of letting them overflow. */}
        <div className="mt-2.5">
          <table className="w-full table-fixed border-collapse text-[12px] leading-[15px] text-black">
            <colgroup>
              <col className="w-[38%] sm:w-[28%] md:w-[17.3%]" />
              <col />
            </colgroup>
            <tbody>
              {groups.flatMap((group) => [
                <tr key={`group-${group.name}`}>
                  <th
                    scope="colgroup"
                    colSpan={2}
                    className="break-words border border-surface-grid px-2 py-[11px] text-left align-top font-medium md:px-3"
                  >
                    {group.name}
                  </th>
                </tr>,
                ...group.products.map((product) => (
                  <tr key={product.id}>
                    <td className="break-all border border-surface-grid px-2 py-[11px] align-top md:break-normal md:px-3">
                      <Link
                        to={`/product/${product.slug || createSlug(product.name)}`}
                        state={{ productId: product.id }}
                        className="text-brand-700 hover:underline"
                      >
                        {product.code}
                      </Link>
                    </td>
                    <td className="break-words border border-surface-grid px-2 py-[11px] align-top md:px-2.5">
                      {product.name}
                    </td>
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
