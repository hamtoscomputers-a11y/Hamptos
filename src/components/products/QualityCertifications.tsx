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
              // The 60px box is a frame, not a disc: certification artwork
              // carries its own shape on a transparent background, so a fill
              // behind it would read as a second, larger badge. The rounding
              // stays as a guard — artwork that turns out to be an opaque
              // rectangle is clipped to the circle rather than left square.
              <span
                key={badge.id}
                title={badge.name}
                className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full"
              >
                {/* Contained rather than cropped, so a wide mark such as
                    "ISO 9001" keeps both ends. */}
                <img
                  src={badge.image_url}
                  alt={badge.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                />
              </span>
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
