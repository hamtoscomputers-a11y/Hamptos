/**
 * Which range of the catalogue a product belongs to.
 *
 * The ERP has no usable field for this — 429 of its 430 products sit under one
 * category — so the range has to come off the product name. The names are not
 * trustworthy on their own, though: vendors put the wrong noun in them, and a
 * plain word match puts firewalls in the switches rail and switches in the
 * routers rail. Each matcher below therefore also knows the model series that
 * contradict the name.
 *
 * Every rule here was checked against the live catalogue rather than assumed.
 * Extend it the same way: look at what the match actually returns before
 * trusting it.
 */

/**
 * Huawei's Unified Security Gateway — firewalls, which the ERP lists as
 * "USG6000E-S13 eKitEngine Switch" with no mention of a firewall. 22 of the 40
 * most recent products are these.
 */
const HUAWEI_FIREWALL_SERIES = /\busg\d/i

/**
 * MikroTik's Cloud Router Switch — switches, sold under a name containing
 * "Router". Most say "Cloud Router Switch", but some only carry the model
 * ("CRS328-24P-4S+RM 24 Port Gigabit Ethernet Router").
 */
const MIKROTIK_SWITCH_SERIES = /\bcrs\d/i

export const isFirewall = (name: string) =>
  /firewall/i.test(name) || HUAWEI_FIREWALL_SERIES.test(name)

export const isSwitch = (name: string) => /switch/i.test(name) && !isFirewall(name)

export const isRouter = (name: string) =>
  /router/i.test(name) && !/switch/i.test(name) && !MIKROTIK_SWITCH_SERIES.test(name)

/**
 * Access points, controllers and Wi-Fi gear.
 *
 * A standalone "AP" counts: three MikroTik access points are named only that
 * way ("hAP lite TC Small Home AP", "AP with Five Ethernet Ports"). Checked
 * across the whole catalogue — those three are the only names containing the
 * word, so it pulls in nothing else.
 *
 * "Switch" is deliberately not excluded here — the Grandstream GWN7604 is a
 * genuine access point that happens to carry an integrated switch in its name.
 * Routers are excluded instead, so the D-Link DIR-3040 ("Wi-Fi Tri-Band
 * Gigabit Router") stays in the routers rail rather than appearing in both.
 */
export const isWireless = (name: string) =>
  /wireless|access point|\bwi-?fi\b|\bap\b/i.test(name) && !isRouter(name)

/**
 * Security, cloud and multi-service gateways.
 *
 * A plain word match is enough here: of the 430 products, 8 carry "Gateway"
 * and none of them is also a switch, router, firewall or access point.
 * Verified against the live catalogue rather than assumed.
 */
export const isGateway = (name: string) => /gateway/i.test(name)
