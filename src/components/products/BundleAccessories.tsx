import { useMemo, useState } from "react"
import { Equal, Minus, Plus } from "lucide-react"
import { useDispatch } from "react-redux"
import { formatAed } from "@/components/home/productCard"
import { addToCart } from "@/store/cartSlice"
import { toast } from "@/hooks/use-toast"
import { useProductAccessories } from "@/api/hooks/useProducts"
import type { AccessoryProduct } from "@/api/types"

interface BundleAccessoriesProps {
  /** Current product id — the accessories are looked up against it. */
  currentId: string
}

interface Accessory {
  id: string
  name: string
  subtitle: string
  image: string
  price: number
  inStock: boolean
  raw: AccessoryProduct
}

const API_URI = import.meta.env.VITE_REACT_APP_API_URI

/**
 * Map an accessory row to the card's shape.
 *
 * The API nulls `promo_price` unless the promotion is running today, so a
 * present value can be taken as the live price without re-checking dates.
 */
const toAccessory = (p: AccessoryProduct): Accessory => {
  const listPrice = Number(p.price) || 0
  const promo = p.promo_price === null || p.promo_price === undefined ? null : Number(p.promo_price)
  const image =
    p.image_url || (p.image ? `${API_URI}/assets/uploads/${p.image}` : "/placeholder.svg?height=140&width=200")
  return {
    id: String(p.id ?? ""),
    name: p.name ?? "",
    subtitle: p.category_name || p.brand_name || "",
    image,
    price: promo && promo > 0 ? promo : listPrice,
    inStock: Number(p.quantity || 0) > 0,
    raw: p,
  }
}

/** The bundle's own compact quantity stepper — the header stepper's smaller sibling. */
const MiniStepper = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex items-center gap-2.5">
    <button
      type="button"
      aria-label="Decrease quantity"
      onClick={() => onChange(Math.max(1, value - 1))}
      disabled={value <= 1}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-surface-trust text-ink-pebble transition hover:brightness-95 disabled:opacity-40"
    >
      <Minus size={14} />
    </button>
    <span className="min-w-[14px] text-center text-[14px] font-medium text-black">{value}</span>
    <button
      type="button"
      aria-label="Increase quantity"
      onClick={() => onChange(value + 1)}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-md bg-surface-trust text-ink-pebble transition hover:brightness-95"
    >
      <Plus size={14} />
    </button>
  </div>
)

const AccessoryCard = ({ item, qty, onQty }: { item: Accessory; qty: number; onQty: (v: number) => void }) => (
  <div className="flex h-full flex-col rounded-lg border border-surface-muted bg-white p-3">
    <div className="flex h-[130px] items-center justify-center overflow-hidden">
      <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" loading="lazy" />
    </div>
    <p className={`mt-2 text-[12px] ${item.inStock ? "text-ink-muted" : "text-ink-grey"}`}>
      {item.inStock ? "In Stock" : "Out of Stock"}
    </p>
    <p className="mt-1 line-clamp-2 text-[14px] font-semibold leading-snug text-ink-slate">{item.name}</p>
    {item.subtitle && <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-ink-muted">{item.subtitle}</p>}
    <p className="mt-2 text-[14px] font-medium text-ink-muted">
      AED <span className="text-brand-700">{formatAed(item.price)}</span>
    </p>
    <div className="mt-2.5">
      <MiniStepper value={qty} onChange={onQty} />
    </div>
  </div>
)

/**
 * "Shop Bundles or Accessories Recommended by Experts".
 *
 * Every card here is a deliberate recommendation made in the ERP under
 * Products → Accessories, not a category neighbour: the tabs are the admin's
 * free-text group names, so a product with "Mount Kit" and "Antennas" groups
 * gets exactly those two tabs and switching between them changes the cards.
 *
 * A product with no accessories set up shows no section at all — the heading
 * promises a recommendation, so an uncurated rail would be a false one.
 */
const BundleAccessories = ({ currentId }: BundleAccessoriesProps) => {
  const dispatch = useDispatch()
  const { data: groups, isLoading } = useProductAccessories(currentId)
  const [tabIndex, setTabIndex] = useState(0)

  const tabs = groups ?? []
  // A product's groups can change under a cached page; clamp rather than
  // render an empty tab.
  const activeIndex = tabIndex < tabs.length ? tabIndex : 0

  const accessories = useMemo(
    () => (tabs[activeIndex]?.products ?? []).map(toAccessory),
    [tabs, activeIndex],
  )

  const [qtys, setQtys] = useState<Record<string, number>>({})
  const qtyOf = (id: string) => qtys[id] ?? 1
  const setQty = (id: string, v: number) => setQtys((prev) => ({ ...prev, [id]: v }))

  const selectedCount = accessories.length
  const comboTotal = accessories.reduce((sum, a) => sum + a.price * qtyOf(a.id), 0)

  const handleAddCombo = () => {
    accessories.forEach((a) => {
      dispatch(
        addToCart({
          item: {
            id: Number(a.id),
            name: a.name,
            price: a.price,
            image: a.image,
            brand: a.raw.brand_name,
            // The accessories endpoint is a lean join and carries no BXGY
            // promotion; the cart treats null as "no offer".
            BXGY: null,
            quantity_available: Number(a.raw.quantity || 0),
          },
          quantity: qtyOf(a.id),
        }),
      )
    })
    toast({ title: "Combo added to cart!", description: `${selectedCount} accessories added` })
  }

  // Nothing curated for this product — drop the section rather than show an
  // empty frame or fill it with products nobody recommended.
  if (!isLoading && tabs.length === 0) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-10">
      <h2 className="text-[24px] font-medium leading-tight tracking-[-0.02em] text-black md:text-[28px]">
        Shop Bundles or Accessories Recommended by Experts
      </h2>

      {/* One tab per accessory group, in the order the API returns them.
          The rule beneath is the Figma's thin solid brand-blue divider. */}
      <div className="mt-5 flex flex-wrap items-center gap-3.5 border-b border-brand-700 pb-5">
        {tabs.map((group, i) => (
          <button
            key={group.name}
            type="button"
            onClick={() => setTabIndex(i)}
            aria-pressed={i === activeIndex}
            // The active tab carries a transparent border so it matches the
            // outlined tab's 46px box — otherwise the two tops sit 1px apart.
            className={`rounded-lg border px-5 py-[15px] text-[14px] font-semibold leading-none transition-colors ${
              i === activeIndex
                ? "border-transparent bg-brand-700 text-white"
                : "border-brand-700 bg-white text-brand-700 hover:bg-surface-accent"
            }`}
          >
            {group.name}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-[14px] text-ink-grey">Loading accessories...</div>
      ) : (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-4">
          {/* Accessory cards, joined by "+" operators. */}
          <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-1 lg:overflow-visible">
            {accessories.flatMap((a, i) => {
              const card = (
                <div key={a.id} className="w-[220px] flex-shrink-0 self-stretch lg:w-auto lg:flex-1">
                  <AccessoryCard item={a} qty={qtyOf(a.id)} onQty={(v) => setQty(a.id, v)} />
                </div>
              )
              return i < accessories.length - 1
                ? [card, <Plus key={`plus-${a.id}`} size={22} className="flex-shrink-0 text-surface-line" aria-hidden />]
                : [card]
            })}
          </div>

          {/* Brand-blue vertical divider. Both rules are unbroken and cross to
              form the Figma's "+". The extension runs from here up to the top
              of the tab buttons, clearing the horizontal rule on the way: the
              row's own mt-6 (24px) + the rule's own 1px + the tab row's pb-5
              (20px) + the buttons' 46px (py-[15px] on 14px/none text + border). */}
          <div className="relative hidden w-px flex-shrink-0 self-stretch bg-brand-700 lg:block" aria-hidden>
            <span className="absolute bottom-full left-0 h-[calc(24px+1px+20px+46px)] w-px bg-brand-700" />
          </div>

          {/* Combo total, preceded by the "=" operator. */}
          <div className="flex items-center gap-4 lg:pl-2">
            <Equal size={34} className="hidden flex-shrink-0 text-surface-line lg:block" aria-hidden />
            <div className="w-[177px] flex-shrink-0">
              <p className="text-[12px] text-ink-muted">
                {selectedCount} {selectedCount === 1 ? "Accessory" : "Accessories"} Selected
              </p>
              <p className="text-[12px] text-ink-muted">Combo Price</p>
              <p className="mt-1 text-[20px] font-medium tracking-tight text-ink-muted">
                AED <span className="text-brand-700">{formatAed(comboTotal)}</span>
              </p>
              <button
                type="button"
                onClick={handleAddCombo}
                className="mt-3 w-full rounded-md bg-brand-700 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-800"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BundleAccessories
