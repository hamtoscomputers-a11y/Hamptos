import NewCollectionRail from "./NewCollectionRail"
import { isGateway } from "./productRanges"

/**
 * "New Gateways Collections" — the last product rail before the newsletter.
 *
 * The Figma repeats the servers heading in this frame, but servers already
 * have their own rail in the grey band above, so this one carries the range
 * the catalogue stocks next: security, cloud and multi-service gateways.
 *
 * None sit inside the recent window, so it resolves through the search — where
 * a single term happens to return exactly the eight of them.
 */
const NewGatewaysSection = () => (
  <NewCollectionRail
    title="New Gateways Collections"
    match={isGateway}
    searchTerms={["gateway"]}
    exploreHref="/products?search=gateway"
  />
)

export default NewGatewaysSection
