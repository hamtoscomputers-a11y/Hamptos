interface TypeChipProps {
  /** The active facet's value, e.g. the category name. */
  value: string
  label?: string
}

/**
 * Two-segment chip naming the facet in play: an orange label cell followed by the
 * active value, per the Figma's 40px-tall chip. Square corners, hairline outline.
 */
const TypeChip = ({ value, label = "Type" }: TypeChipProps) => (
  <div className="inline-flex h-10 items-stretch border border-surface-muted text-[13px]">
    <span className="flex items-center bg-highlight px-3 font-medium text-black">{label}</span>
    <span className="flex items-center border-l border-surface-muted bg-white px-3 text-black">{value}</span>
  </div>
)

export default TypeChip
