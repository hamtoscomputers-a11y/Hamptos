export interface ResourceGroup {
  /** The grey label above the rule, e.g. "Support and Resources". */
  label: string
  /** File name as shown, e.g. "Datasheet.pdf". */
  fileName: string
  /** Destination. Omitted while there is nothing to point at. */
  url?: string
}

interface ResourcesDownloadsProps {
  /**
   * The ERP has no attachment, download or datasheet field — `products/view/{id}`
   * returns 18 fields and none of them is a file — so this is empty in practice
   * and the Figma's own entries stand in.
   */
  groups?: ResourceGroup[]
}

/**
 * The Figma's PDF mark: a folded page with a filled "PDF" badge across its foot.
 * Drawn inline because lucide has no PDF icon — its nearest, `FileText`, is a
 * generic lined page. Inherits `currentColor`, so the page follows the text.
 */
const PdfIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
    <path
      d="M14.5 2.75H7A1.25 1.25 0 0 0 5.75 4v16A1.25 1.25 0 0 0 7 21.25h10A1.25 1.25 0 0 0 18.25 20V6.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M14.5 2.75V6.5h3.75" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="2.5" y="12.25" width="13.5" height="7.25" rx="1.25" fill="currentColor" />
    <text
      x="9.25"
      y="17.9"
      textAnchor="middle"
      fontSize="5.6"
      fontWeight="700"
      fontFamily="Arial, Helvetica, sans-serif"
      fill="#fff"
    >
      PDF
    </text>
  </svg>
)

const PLACEHOLDER_GROUPS: ResourceGroup[] = [
  { label: "Support and Resources", fileName: "resource.pdf" },
  { label: "Support and Resources", fileName: "Datasheet.pdf" },
]

/**
 * "Resources Downloads", per the Figma's blocks at x212:
 *
 *   heading  275 x 29   28 / 28.9 / -2%          #000000
 *   label    356 x 20   Inter Light 14 / 142.1%  #2A4153
 *   row     1303 x 58   1px #000000 at 50% top and bottom
 *   file     762 x 16 at (7, 21) — centred in the 58, gap 2, link #0073ED
 */
const ResourcesDownloads = ({ groups }: ResourcesDownloadsProps) => {
  const list = groups?.length ? groups : PLACEHOLDER_GROUPS

  if (!list.length) return null

  return (
    <section
      className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]"
      aria-labelledby="resources-downloads-heading"
    >
      <h2
        id="resources-downloads-heading"
        className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black"
      >
        Resources Downloads
      </h2>

      {list.map((group, index) => (
        <div key={`${group.label}-${group.fileName}`} className={index === 0 ? "mt-[5px]" : "mt-[15px]"}>
          <p className="text-[14px] font-light leading-[1.421] text-ink-slate">{group.label}</p>

          {/* 8198 - 8193 = 5 under the label. The file row sits at y21 in a
              58-tall block and is 16 high, so it centres with 21 either side. */}
          <div className="mt-[5px] flex h-[58px] items-center border-y border-black/50 px-[7px]">
            {group.url ? (
              <a
                href={group.url}
                download
                className="flex items-center gap-0.5 text-[12px] leading-4 text-link underline hover:no-underline"
              >
                <span className="flex-shrink-0 text-black">
                  <PdfIcon />
                </span>
                {group.fileName}
              </a>
            ) : (
              // No destination yet — shown, but not offered as a working link.
              <span className="flex items-center gap-0.5 text-[12px] leading-4 text-link underline">
                <span className="flex-shrink-0 text-black">
                  <PdfIcon />
                </span>
                {group.fileName}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

export default ResourcesDownloads
