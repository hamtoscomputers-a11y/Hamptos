export interface SpecRow {
  label: string
  value: string
}

export interface SpecGroup {
  /** Empty when the ERP listed rows without a heading above them. */
  title: string
  rows: SpecRow[]
}

/**
 * `key_information` comes back as a bare HTML table in which a row holding a
 * single cell is a group heading and every two-cell row is a spec beneath it —
 * the "Main" / "Weight" grouping the Figma draws. Cells are read as text rather
 * than injected, so nothing from the ERP reaches the DOM as markup.
 */
export const parseSpecGroups = (html: string): SpecGroup[] => {
  if (typeof DOMParser === "undefined") return []

  const rows = new DOMParser().parseFromString(html, "text/html").querySelectorAll("tr")
  const groups: SpecGroup[] = []

  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll("td, th")).map((cell) => cell.textContent?.trim() ?? "")

    if (cells.length === 1) {
      if (cells[0]) groups.push({ title: cells[0], rows: [] })
      return
    }

    if (cells.length < 2 || !cells[0]) return

    // Rows can precede any heading, so open an untitled group to hold them.
    if (!groups.length) groups.push({ title: "", rows: [] })
    groups[groups.length - 1].rows.push({ label: cells[0], value: cells.slice(1).join(" ") })
  })

  return groups.filter((group) => group.rows.length)
}

/**
 * The Product Specifications panel: each group's heading in a 202px gutter to
 * the left of a 410px striped table, per the Figma's 905 x 297 frame.
 */
const ProductSpecifications = ({ groups }: { groups: SpecGroup[] }) => {
  // With no headings at all the gutter would just be dead space, so the tables
  // take the full measure instead.
  const hasTitles = groups.some((group) => group.title)

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group, groupIndex) => (
        <div key={`${group.title}-${groupIndex}`} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-0">
          {hasTitles && (
            <h3 className="text-[14px] font-semibold leading-[19px] text-ink-title sm:w-[202px] sm:flex-shrink-0">
              {group.title}
            </h3>
          )}

          <table className="w-full max-w-[410px] border-collapse border border-surface-control text-[14px] leading-[19px] text-black">
            <tbody>
              {group.rows.map((row, rowIndex) => (
                <tr key={`${row.label}-${rowIndex}`} className={rowIndex % 2 === 0 ? "bg-surface-subtle" : "bg-white"}>
                  <td className="py-[9px] pl-[17px] pr-2 align-top sm:w-[145px]">{row.label}</td>
                  <td className="py-[9px] pr-[17px] align-top">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

export default ProductSpecifications
