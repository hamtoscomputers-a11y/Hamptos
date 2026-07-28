import { useMemo, useState } from "react"
import { Equal, Minus, Plus } from "lucide-react"
import { useDispatch } from "react-redux"
import { formatAed } from "@/components/home/productCard"
import { addToCart } from "@/store/cartSlice"
import { toast } from "@/hooks/use-toast"

interface BundleAccessoriesProps {
  /** Same-category products — the first choice to fill the accessory cards. */
  products: any[]
  /** Catalogue-wide pool, used to top up when the category holds too few others. */
  fallbackProducts?: any[]
  /** Current product id, excluded so the bundle never recommends the page's own item. */
  currentId: string
  isLoading: boolean
}

interface Accessory {
  id: string
  name: string
  subtitle: string
  image: string
  price: number
  inStock: boolean
  raw: any
}

const API_URI = import.meta.env.VITE_REACT_APP_API_URI

/** Map a raw ERP product to the accessory card's shape — only real fields. */
const toAccessory = (p: any): Accessory => {
  const priceValue = p?.unit_price || p?.net_price || p?.price
  const price =
    p?.promo_price && Number(p.promo_price) < Number(priceValue) ? Number(p.promo_price) : Number(priceValue)
  const image =
    p?.image_url || (p?.image ? `${API_URI}/assets/uploads/${p.image}` : "/placeholder.svg?height=140&width=200")
  const brand = typeof p?.brand === "object" ? p?.brand?.name : p?.brand
  const category = typeof p?.category === "object" ? p?.category?.name : ""
  return {
    id: String(p?.id ?? ""),
    name: p?.name ?? "",
    subtitle: category || brand || "",
    image,
    price: Number(price) || 0,
    inStock: Number(p?.quantity || 0) > 0,
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

/** The two accessory groups. The ERP has no such grouping, so these are presentational tabs. */
const TABS = [
  { key: "mount", label: "Mount Kit" },
  { key: "antennas", label: "Antennas" },
] as const

/**
 * "Shop Bundles or Accessories Recommended by Experts": a curated-looking rail
 * built from live catalogue products, with a running combo total. The grouping
 * tabs and the "recommended by experts" framing are presentational.
 */
const BundleAccessories = ({ products, fallbackProducts = [], currentId, isLoading }: BundleAccessoriesProps) => {
  const dispatch = useDispatch()
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("mount")

  // Same-category products first; top up from the catalogue pool when the
  // category holds nothing but this product. De-duplicated, current one dropped.
  const accessories = useMemo(() => {
    const seen = new Set([currentId])
    const picked: any[] = []
    for (const pool of [products || [], fallbackProducts]) {
      for (const p of pool) {
        const id = String(p?.id ?? "")
        if (!id || seen.has(id)) continue
        seen.add(id)
        picked.push(p)
        if (picked.length >= 4) break
      }
      if (picked.length >= 4) break
    }
    return picked.map(toAccessory)
  }, [products, fallbackProducts, currentId])

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
            brand: typeof a.raw?.brand === "object" ? a.raw.brand?.name : a.raw?.brand,
            BXGY: a.raw?.BXGY || null,
            quantity_available: Number(a.raw?.quantity || 0),
          },
          quantity: qtyOf(a.id),
        }),
      )
    })
    toast({ title: "Combo added to cart!", description: `${selectedCount} accessories added` })
  }

  // Nothing to recommend — drop the section rather than show an empty frame.
  if (!isLoading && accessories.length === 0) return null

  return (
    <section className="container mx-auto px-4 sm:px-6 md:px-8 py-10">
      <h2 className="text-[24px] font-medium leading-tight tracking-[-0.02em] text-black md:text-[28px]">
        Shop Bundles or Accessories Recommended by Experts
      </h2>

      {/* Grouping tabs — presentational; both show the same live pool.
          The rule beneath is the Figma's thin solid brand-blue divider. */}
      <div className="mt-5 flex items-center gap-3.5 border-b border-brand-700 pb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={`rounded-lg px-5 py-[15px] text-[14px] font-semibold leading-none transition-colors ${
              tab === t.key
                ? "bg-brand-700 text-white"
                : "border border-brand-700 bg-white text-brand-700 hover:bg-surface-accent"
            }`}
          >
            {t.label}
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

          {/* Brand-blue vertical divider. The horizontal rule (24px above, the
              mt-6 gap) runs unbroken; the vertical is split around it — a short
              stub floating above, then the line resuming below, each ~8px clear
              of the rule — the Figma's gapped "+" intersection. */}
          <div className="relative hidden w-px flex-shrink-0 self-stretch bg-brand-700 lg:block" aria-hidden>
            {/* line resumes ~8px below the rule (rule sits 24px above this top) */}
            <span className="absolute bottom-full left-0 h-4 w-px bg-brand-700" />
            {/* short stub floating ~8px above the rule */}
            <span className="absolute left-0 top-[-52px] h-5 w-px bg-brand-700" />
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
