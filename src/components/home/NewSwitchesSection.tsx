import { useCallback } from "react"
import NewCollectionRail from "./NewCollectionRail"

/**
 * "New Switches Collections".
 *
 * Firewalls are excluded even though the ERP names every one of them
 * "… Firewall Switch": they have their own rail further down the page, and
 * without this the two would show largely the same products.
 */
const NewSwitchesSection = () => {
  const match = useCallback((name: string) => /switch/i.test(name) && !/firewall/i.test(name), [])

  return (
    <NewCollectionRail
      title="New Switches Collections"
      match={match}
      exploreHref="/products?search=switch"
    />
  )
}

export default NewSwitchesSection
