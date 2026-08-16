import {
  Award,
  BadgeCheck,
  Check,
  Clock,
  Headphones,
  RefreshCw,
  ShieldCheck,
  ThumbsUp,
  Truck,
  type LucideIcon,
} from "lucide-react"
import type { ProductSectionBlock } from "@/api/types"

/**
 * How a section arranges its cards. The section decides, not the content, so
 * the page stays on design whoever types into the ERP.
 *
 *   cards     three-up grid, icon above a heading and a paragraph
 *   checklist ticked list, two columns — for reasons and audiences
 *   iconRow   one horizontal band of small icon + text, like the trust band
 *   prose     a single paragraph under the heading, no card
 */
export type SectionLayout = "cards" | "checklist" | "iconRow" | "prose"

interface ProductContentSectionProps {
  /** Rendered as the section's `h2`. */
  title: string
  /** Optional line under the heading. */
  subtitle?: string
  blocks: ProductSectionBlock[]
  layout: SectionLayout
  /** Drawn when a block names no icon of its own. */
  fallbackIcon?: LucideIcon
}

/** The ERP's icon keys, which are the only ones its admin screen offers. */
const ICONS: Record<string, LucideIcon> = {
  "shield-check": ShieldCheck,
  "badge-plus": BadgeCheck,
  award: Award,
  truck: Truck,
  headphones: Headphones,
  refresh: RefreshCw,
  clock: Clock,
  "thumbs-up": ThumbsUp,
}

/**
 * Rich text from the ERP's editor. Sanitised to an allowlist server-side by
 * `Products_api::safeHtml()` before it is sent, which is why it can be injected
 * here — the same arrangement the product description and Q&A answers use.
 */
const BODY_PROSE =
  "[&_a]:text-brand-700 [&_a]:underline [&_b]:font-semibold [&_li]:mt-0.5 [&_ol]:mt-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mt-2 [&_p:first-child]:mt-0 [&_strong]:font-semibold [&_ul]:mt-1.5 [&_ul]:list-disc [&_ul]:pl-5"

/**
 * One of the written sections the shop types under a product's Page Content
 * tab — Why Choose This Product, Features & Capabilities, Use Cases, Who Is
 * This Product For, the price paragraph, Availability and Support.
 *
 * One component for all of them because they are one shape: an optional mark,
 * a heading and a paragraph, repeated. Only the arrangement differs, and that
 * is the `layout` prop rather than seven near-identical files.
 *
 * Renders nothing when the shop has typed nothing, so a product part-way
 * through being written up shows only the sections that are ready.
 */
const ProductContentSection = ({
  title,
  subtitle,
  blocks,
  layout,
  fallbackIcon,
}: ProductContentSectionProps) => {
  if (!blocks.length) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 pt-[50px]" aria-label={title}>
      <h2 className="text-[28px] font-medium leading-[28.9px] tracking-[-0.02em] text-black">{title}</h2>
      {subtitle && <p className="mt-2 max-w-[720px] text-[14px] leading-[22px] text-ink-slate">{subtitle}</p>}

      {layout === "prose" && (
        /* The price paragraph. One block, no card: it is a paragraph of prose
           under a heading, and boxing it would read as a callout. */
        <div
          className={`mt-3 max-w-[820px] text-[14px] font-light leading-[1.6] text-ink-slate ${BODY_PROSE}`}
          dangerouslySetInnerHTML={{ __html: blocks[0].body }}
        />
      )}

      {layout === "cards" && (
        <div className="mt-5 grid grid-cols-1 gap-[15px] sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => {
            const Icon = ICONS[block.icon] ?? fallbackIcon
            return (
              <article
                key={block.id}
                className="rounded-lg border border-surface-line bg-white p-5 transition-shadow hover:shadow-sm"
              >
                {Icon && (
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                    <Icon size={20} aria-hidden />
                  </span>
                )}
                {block.heading && (
                  <h3 className="text-[15px] font-semibold leading-snug text-black">{block.heading}</h3>
                )}
                {block.body && (
                  <div
                    className={`mt-1.5 text-[13px] font-light leading-[1.55] text-ink-slate ${BODY_PROSE}`}
                    dangerouslySetInnerHTML={{ __html: block.body }}
                  />
                )}
              </article>
            )
          })}
        </div>
      )}

      {layout === "checklist" && (
        /* Reasons and audiences. A tick rather than the block's own icon: the
           list reads as a set of claims, and a different glyph per line breaks
           the column the ticks make down the left. */
        <ul className="mt-4 grid grid-cols-1 gap-x-10 gap-y-3.5 md:grid-cols-2">
          {blocks.map((block) => (
            <li key={block.id} className="flex gap-2.5">
              <Check size={18} className="mt-0.5 flex-shrink-0 text-brand-700" aria-hidden />
              <div className="min-w-0">
                {block.heading && (
                  <span className="block text-[14px] font-semibold leading-snug text-black">{block.heading}</span>
                )}
                {block.body && (
                  <div
                    className={`mt-0.5 text-[13px] font-light leading-[1.55] text-ink-slate ${BODY_PROSE}`}
                    dangerouslySetInnerHTML={{ __html: block.body }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {layout === "iconRow" && (
        /* Delivery and warranty. A band rather than cards, so it reads as the
           practical footnote to the sections above it rather than another
           block of selling copy. */
        <div className="mt-4 flex flex-wrap gap-x-10 gap-y-5 rounded-lg bg-brand-100/50 px-6 py-5">
          {blocks.map((block) => {
            const Icon = ICONS[block.icon] ?? fallbackIcon
            return (
              <div key={block.id} className="flex min-w-[240px] flex-1 gap-3">
                {Icon && <Icon size={22} className="mt-0.5 flex-shrink-0 text-brand-700" aria-hidden />}
                <div className="min-w-0">
                  {block.heading && (
                    <span className="block text-[14px] font-semibold leading-snug text-black">{block.heading}</span>
                  )}
                  {block.body && (
                    <div
                      className={`mt-0.5 text-[13px] font-light leading-[1.55] text-ink-slate ${BODY_PROSE}`}
                      dangerouslySetInnerHTML={{ __html: block.body }}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default ProductContentSection
