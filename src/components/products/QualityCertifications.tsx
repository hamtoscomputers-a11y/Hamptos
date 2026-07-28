/** Six 60px discs on a 403-wide block: 6 x 60 + 5 x 8.6 = 403. */
const BADGE_COUNT = 6

/**
 * "Quality Certifications", per the Figma's 403 x 99 block at x212 with a 10px
 * vertical gap: the heading over a row of discs.
 *
 * The Figma leaves the discs as flat #D9D9D9 placeholders with no logos in them,
 * and the ERP carries no certification data, so they are presentational until
 * certification artwork exists. The section appears twice on the page.
 */
const QualityCertifications = () => (
  <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label="Quality Certifications">
    <div className="max-w-[403px]">
      <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">
        Quality Certifications
      </h2>

      <div className="mt-2.5 flex flex-wrap gap-[8.6px]" aria-hidden>
        {Array.from({ length: BADGE_COUNT }, (_, index) => (
          <span key={index} className="h-[60px] w-[60px] flex-shrink-0 rounded-full bg-surface-line" />
        ))}
      </div>
    </div>
  </section>
)

export default QualityCertifications
