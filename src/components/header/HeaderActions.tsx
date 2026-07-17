import { Bell, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

interface HeaderActionsProps {
  cartCount: number
}

/**
 * Account / notifications / cart cluster on the right of the main header row.
 *
 * The account and notification affordances are presentational: this storefront
 * has no auth or notification backend yet, so they render per the design but
 * intentionally do not navigate. Wire them up when those features land.
 */
const HeaderActions = ({ cartCount }: HeaderActionsProps) => (
  <div className="flex items-center gap-4 sm:gap-6">
    <div className="hidden text-[13px] leading-tight text-brand-950 lg:block">
      <div>Hello, Sign in</div>
      <div className="font-semibold">Accounts &amp; Orders</div>
    </div>

    <Bell size={22} className="hidden text-brand-950 sm:block" aria-hidden />

    <Link
      to="/cart"
      className="relative text-brand-950 hover:text-brand-700"
      aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
    >
      <ShoppingBag size={22} aria-hidden />
      {cartCount > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-bold text-white">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  </div>
)

export default HeaderActions
