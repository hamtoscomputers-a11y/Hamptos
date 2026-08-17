import { useMemo } from "react"
import { parseSpecGroups, type SpecRow } from "./ProductSpecifications"

interface ProductSpecTableProps {
  brand: string
  /** The ERP product `code` — names the section, as "Aruba Q9H62A Specification". */
  code: string
  name: string
  /** `key_information` from the ERP — the label/value pairs this table lays out. */
  keyInformation?: string
}

/** One table row: a label/value pair on the left, and its opposite number on the right. */
interface PairedRow {
  left: SpecRow
  right?: SpecRow
}

/**
 * The full specification table, per the Figma's 1304 x 392 block at x212 with a
 * 30px vertical gap between heading and table.
 *
 * Two label/value pairs sit on every row, the halves meeting at the midpoint,
 * and the stripe runs unbroken across the whole 1304 — one table, not two side
 * by side. Rows carry no borders: 1A74BB at 15% over DDDDDD at 20% is the only
 * separation.
 *
 * Heading and rows are all live — the brand name and `code` title the section,
 * and the rows are the ERP's `key_information` folded into two columns.
 */
const ProductSpecTable = ({ brand, code, name, keyInformation }: ProductSpecTableProps) => {
  const rows = useMemo<PairedRow[]>(() => {
    const specs = keyInformation ? parseSpecGroups(keyInformation).flatMap((group) => group.rows) : []
    // The Figma reads down the left half then down the right, so the split is
    // by half rather than alternating across each row.
    const split = Math.ceil(specs.length / 2)
    return specs.slice(0, split).map((left, index) => ({ left, right: specs[split + index] }))
  }, [keyInformation])

  if (!rows.length) return null

  const title = [brand, code || name, "Specification"].filter(Boolean).join(" ")
  const stacked = rows.flatMap((row) => [row.left, ...(row.right ? [row.right] : [])])

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label={title}>
      <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">{title}</h2>

      {/* Phones cannot fit four table-fixed columns; labels like Manufacturer
          collide with the value. Stack as label/value pairs until `md`. */}
      <div className="mt-[30px] md:hidden">
        <table className="w-full table-fixed border-collapse text-[12px] leading-[15px] text-black">
          <colgroup>
            <col className="w-[42%]" />
            <col />
          </colgroup>
          <tbody>
            {stacked.map((spec, index) => (
              <tr key={`${spec.label}-${index}`} className={index % 2 === 0 ? "bg-brand-700/15" : "bg-surface-mist/20"}>
                <th scope="row" className="break-words px-2 py-[11px] text-left align-top font-normal">
                  {spec.label}
                </th>
                <td className="break-words whitespace-pre-line px-2 py-[11px] align-top">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-[30px] hidden overflow-x-auto md:block">
        <table className="w-full table-fixed border-collapse text-[12px] leading-[15px] text-black">
          {/* The halves meet at the midpoint; each splits 43/57 between its
              label and its value, as the Figma sets them. */}
          <colgroup>
            <col className="w-[21.5%]" />
            <col className="w-[28.5%]" />
            <col className="w-[21.5%]" />
            <col />
          </colgroup>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.left.label}-${index}`} className={index % 2 === 0 ? "bg-brand-700/15" : "bg-surface-mist/20"}>
                <th scope="row" className="break-words px-2.5 py-[11px] text-left align-top font-normal">
                  {row.left.label}
                </th>
                <td className="break-words whitespace-pre-line px-2.5 py-[11px] align-top">{row.left.value}</td>
                <th scope="row" className="break-words px-2.5 py-[11px] text-left align-top font-normal">
                  {row.right?.label ?? ""}
                </th>
                <td className="break-words whitespace-pre-line px-2.5 py-[11px] align-top">{row.right?.value ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default ProductSpecTable
