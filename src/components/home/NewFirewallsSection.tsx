import { isFirewall } from "./productRanges"
import NewCollectionRail from "./NewCollectionRail"

/**
 * "New Firewalls Collections" — the second rail of the same design, below
 * Shop By Categories.
 *
 * The Figma repeats the switches heading here, but the frame is the same rail
 * carrying a different range, so it is titled for what it actually shows.
 * Sourced by name rather than by category: the ERP's `Firewall` category (42)
 * is empty.
 */
const NewFirewallsSection = () => (
  <NewCollectionRail
    title="New Firewalls Collections"
    match={isFirewall}
    exploreHref="/products?search=firewall"
  />
)

export default NewFirewallsSection
