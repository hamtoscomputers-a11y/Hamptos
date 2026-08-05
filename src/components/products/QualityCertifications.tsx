import { useProductCertifications } from "@/api/hooks/useProducts"

interface QualityCertificationsProps {
  /** Current product id — the badges are looked up against it. */
  currentId: string
}

/**
 * "Quality Certifications", per the Figma's 403 x 99 block at x212 with a 10px
 * vertical gap: the heading over a row of badges.
 *
 * The badges are the ones assigned to this product in the ERP under
 * Products → Certifications, each rendered as its uploaded logo. A product with
 * none assigned shows no section — the Figma's grey discs were placeholders for
 * artwork, not a design element to keep.
 *
 * The section appears twice on the page, so both instances read the same cached
 * query rather than fetching twice.
 */
const QualityCertifications = ({ currentId }: QualityCertificationsProps) => {
  const { data, isLoading } = useProductCertifications(currentId)
  const badges = data ?? []

  if (isLoading || !badges.length) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label="Quality Certifications">
      <div className="max-w-[403px]">
        <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">
          Quality Certifications
        </h2>

        <div className="mt-2.5 flex flex-wrap items-center gap-[8.6px]">
          {badges.map((badge) =>
            badge.image_url ? (
              // 60px disc in the Figma. Contained, so a wide mark such as
              // "ISO 9001" is not cropped to fit a circle.
              <img
                key={badge.id}
                src={badge.image_url}
                alt={badge.name}
                title={badge.name}
                loading="lazy"
                className="h-[60px] w-[60px] flex-shrink-0 rounded-full object-contain"
              />
            ) : (
              // Named but no logo uploaded yet — the name still tells the
              // shopper what the product carries.
              <span
                key={badge.id}
                className="flex h-[60px] min-w-[60px] flex-shrink-0 items-center justify-center rounded-full bg-surface-line px-2 text-center text-[10px] font-medium leading-tight text-ink-slate"
              >
                {badge.name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}

export default QualityCertifications
