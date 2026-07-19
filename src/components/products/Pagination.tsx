interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  /** How many numbered pages to show at once; the Figma shows six. */
  windowSize?: number
}

/**
 * Page numbers plus a Next button, per the Figma's 30px pagination frame.
 * Numbers are windowed so a 22-page result doesn't render 22 buttons.
 */
const Pagination = ({ page, totalPages, onPageChange, windowSize = 6 }: PaginationProps) => {
  // Nothing to page through.
  if (totalPages <= 1) return null

  // Keep the current page inside the window, clamped at both ends.
  const start = Math.max(1, Math.min(page - Math.floor((windowSize - 1) / 2), totalPages - windowSize + 1))
  const pages = Array.from({ length: Math.min(windowSize, totalPages) }, (_, i) => start + i)

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-[15px]">
      {pages.map((pageNum) => {
        const isCurrent = pageNum === page

        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onPageChange(pageNum)}
            aria-current={isCurrent ? "page" : undefined}
            className={
              isCurrent
                ? "flex h-[26px] min-w-[26px] items-center justify-center rounded-[3px] bg-brand-700 px-1 text-[13px] text-white"
                : "text-[13px] text-ink-pewter transition-colors hover:text-brand-700"
            }
          >
            {pageNum}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="h-[26px] rounded-[3px] bg-ink-graphite px-3 text-[13px] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
