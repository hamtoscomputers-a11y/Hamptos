import { BadgeCheck } from "lucide-react"
import { Link } from "react-router-dom"

interface QuoteButtonProps {
  className?: string
}

const QuoteButton = ({ className = "" }: QuoteButtonProps) => (
  <Link
    to="/get-quote"
    className={`inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-bold tracking-wide text-white transition-colors hover:bg-brand-800 ${className}`}
  >
    <BadgeCheck size={16} aria-hidden />
    GET A QUOTE
  </Link>
)

export default QuoteButton
