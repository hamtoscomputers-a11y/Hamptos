import { useMemo } from "react"
import { parseSpecGroups } from "./ProductSpecifications"

interface QuickSpecsProps {
  /** The ERP product `code` — the Figma's SKU row and the figure caption. */
  code: string
  /** Product image, already resolved to an absolute URL by the page. */
  image: string
  name: string
  /** Category name — the Figma's "Product Type" row. */
  categoryName?: string
  /** `key_information` from the ERP: a flat label/value HTML table. */
  keyInformation?: string
}

/**
 * Quick Specs, per the Figma's 1304-wide block at x212:
 *
 *   "Quick Specs"           28 / 28.9 / -2%   #000000
 *   figure caption          14 Light / 142.1% #2A4153   (6px below)
 *   509 x 509 image frame                               (30px below)
 *   figure caption + table                              (30px below, 10px apart)
 *
 * The table is the ERP's `key_information` rows, led by the two the Figma names
 * outright — SKU (`code`) and Product Type (`category.name`). Every value is
 * live; nothing here is placeholder copy.
 */
const QuickSpecs = ({ code, image, name, categoryName, keyInformation }: QuickSpecsProps) => {
  const rows = useMemo(() => {
    // `parseSpecGroups` reads cells as text, so ERP markup never reaches the DOM.
    const parsed = keyInformation ? parseSpecGroups(keyInformation).flatMap((group) => group.rows) : []

    return [
      ...(code ? [{ label: "SKU", value: code }] : []),
      ...(categoryName ? [{ label: "Product Type", value: categoryName }] : []),
      ...parsed,
    ]
  }, [code, categoryName, keyInformation])

  // With no code and nothing parsed there is no figure to caption and no table.
  if (!code && !rows.length) return null

  const caption = code ? `Figure 1 shows the appearance of ${code}.` : `Figure 1 shows the appearance of ${name}.`

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-10" aria-labelledby="quick-specs-heading">
      <h2
        id="quick-specs-heading"
        className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Quick Specs
      </h2>

      <p className="mt-1.5 text-[14px] font-light leading-[1.421] text-ink-slate">{caption}</p>

      {/* 509 square in the Figma, clipped. Contained rather than cropped so the
          ERP's own framing of the product is preserved at any aspect ratio. */}
      <div className="mt-[30px] aspect-square w-full max-w-[509px] overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-contain" loading="lazy" />
      </div>

      <div className="mt-[30px]">
        <p className="text-[14px] font-light leading-[1.421] text-ink-slate">{caption}</p>

        {/* 10px under the caption, per the block's vertical gap. Scrolls rather
            than squashing the two columns on a narrow viewport. */}
        <div className="mt-2.5 overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-[12px] leading-[15px] text-black">
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${row.label}-${index}`}>
                  {/* 242 of the Figma's 1304 — the label gutter. */}
                  <th
                    scope="row"
                    className="w-[18.6%] border border-surface-grid px-3 py-[11px] text-left align-top font-medium"
                  >
                    {row.label}
                  </th>
                  <td className="whitespace-pre-line border border-surface-grid px-2.5 py-[11px] align-top">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default QuickSpecs
