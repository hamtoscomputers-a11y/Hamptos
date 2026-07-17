import { CONTACT } from "@/components/header/navigation"
import { SERVICE_FEATURES } from "./serviceFeatures"

/**
 * Slim trust/reassurance strip between the header and the hero slider.
 * Collapses to a 2-up then 1-up grid below `lg`, where the Figma's fixed
 * 64px row cannot hold four items legibly.
 */
const ServiceFeatures = () => (
  <section aria-label="Why shop with us" className="bg-surface-accent">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-5 sm:grid-cols-2 lg:h-16 lg:grid-cols-4 lg:gap-x-8 lg:py-0">
        {SERVICE_FEATURES.map(({ icon, title, description, phone }) => (
          <div key={title} className="flex items-center gap-3 lg:h-full">
            <img src={icon} alt="" aria-hidden className="h-8 w-8 flex-shrink-0 object-contain" />

            <div className="min-w-0">
              <h3 className="truncate text-[13px] font-bold text-black/[.78]">
                {title}
                {phone && (
                  <>
                    {" "}
                    <a href={CONTACT.phoneHref} className="font-semibold text-brand-300 hover:underline">
                      {phone}
                    </a>
                  </>
                )}
              </h3>
              <p className="truncate text-xs text-black/[.78]">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default ServiceFeatures
