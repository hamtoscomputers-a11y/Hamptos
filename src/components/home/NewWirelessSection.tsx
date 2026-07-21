import NewCollectionRail from "./NewCollectionRail"
import { isWireless } from "./productRanges"

/**
 * "New Wireless Collections" — the rail below the clearance banner.
 *
 * The Figma repeats the routers heading in this frame, but routers already
 * have their own rail inside the blue band above, so this one carries the next
 * range the catalogue actually stocks: access points and Wi-Fi gear.
 *
 * None of them fall inside the recent window the switches and firewalls rails
 * read from, and no single search term reaches the whole range, so it resolves
 * through several searches merged together. See `NewCollectionRail`.
 */
const NewWirelessSection = () => (
  <NewCollectionRail
    title="New Wireless Collections"
    match={isWireless}
    searchTerms={["access", "wireless", "wifi", "ap"]}
    exploreHref="/products?search=access%20point"
  />
)

export default NewWirelessSection
