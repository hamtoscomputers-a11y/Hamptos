import { BadgeCheck } from "lucide-react"
import { Link } from "react-router-dom"

interface QuoteButtonProps {
  className?: string
}

const QuoteButton = ({ className = "" }: QuoteButtonProps) => (
  <Link
    to="/get-quote"
    // 6px corners, not a pill: the Figma draws this as a rounded rectangle
    // matching the search field's radius, 146x40 on a `brand-700` fill.
    className={`inline-flex h-10 items-center gap-2 rounded-md bg-brand-700 px-5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-800 ${className}`}
  >
    <BadgeCheck size={16} aria-hidden />
    GET A QUOTE
  </Link>
)

export default QuoteButton
