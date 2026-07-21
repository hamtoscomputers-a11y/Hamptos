import { useCallback } from "react"
import NewCollectionRail from "./NewCollectionRail"

/**
 * "New Firewalls Collections" — the second rail of the same design, below
 * Shop By Categories.
 *
 * The Figma repeats the switches heading here, but the frame is the same rail
 * carrying a different range, so it is titled for what it actually shows.
 * Sourced by name rather than by category: the ERP's `Firewall` category (42)
 * is empty, while 11 products carry the word in their name.
 */
const NewFirewallsSection = () => {
  const match = useCallback((name: string) => /firewall/i.test(name), [])

  return (
    <NewCollectionRail
      title="New Firewalls Collections"
      match={match}
      exploreHref="/products?search=firewall"
    />
  )
}

export default NewFirewallsSection
