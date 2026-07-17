import { Search } from "lucide-react"
import { SEARCH_PLACEHOLDER } from "./navigation"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
  className?: string
}

const SearchBar = ({ value, onChange, onSubmit, className = "" }: SearchBarProps) => (
  <form onSubmit={onSubmit} role="search" className={className}>
    <div className="relative">
      <label htmlFor="header-search" className="sr-only">
        Search products
      </label>
      <input
        id="header-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={SEARCH_PLACEHOLDER}
        className="h-11 w-full rounded-md border border-surface-line bg-white pl-4 pr-11 text-sm text-brand-950 placeholder:text-black/40 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-brand-700 hover:text-brand-800"
      >
        <Search size={18} aria-hidden />
      </button>
    </div>
  </form>
)

export default SearchBar
