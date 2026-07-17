import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

/**
 * Owns the header search box state and keeps it in sync with the URL:
 * the input mirrors `?search=` on /products, and clears on every other route.
 */
export const useHeaderSearch = () => {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).get("search")
    const isSearchResultsPage = location.pathname === "/products" && searchParam
    setQuery(isSearchResultsPage ? searchParam : "")
  }, [location.pathname, location.search])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (trimmed) navigate(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  return { query, setQuery, submit }
}
