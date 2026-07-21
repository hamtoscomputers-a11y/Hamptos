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
        // 626x50 with a 5px radius and a solid 1px `#1985C9` edge — the Figma
        // outlines this field in the brand blue rather than a neutral hairline.
        className="h-[50px] w-full rounded-[5px] border border-brand-500 bg-white px-6 text-sm text-brand-950 placeholder:text-black/40 focus:border-brand-700 focus:outline-none focus:ring-1 focus:ring-brand-700"
      />
      {/* The Figma draws no magnifier inside the field, so the control is
          submit-on-Enter only. The button stays in the DOM but off-screen:
          removing it would drop the accessible name for the search action
          and the "Search" key on mobile keyboards. */}
      <button type="submit" className="sr-only">
        Search
      </button>
    </div>
  </form>
)

export default SearchBar
