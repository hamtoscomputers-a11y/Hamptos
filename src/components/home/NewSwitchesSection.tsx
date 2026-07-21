import { isSwitch } from "./productRanges"
import NewCollectionRail from "./NewCollectionRail"

/**
 * "New Switches Collections".
 *
 * Firewalls are excluded even though the ERP names every one of them as a
 * switch: they have their own rail further down the page, and the Huawei USG
 * series carries no "firewall" in its name at all. See `productRanges`.
 */
const NewSwitchesSection = () => (
  <NewCollectionRail
    title="New Switches Collections"
    match={isSwitch}
    exploreHref="/products?search=switch"
  />
)

export default NewSwitchesSection
