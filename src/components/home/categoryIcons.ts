import {
  BrickWall,
  Cable,
  Cctv,
  CircuitBoard,
  CreditCard,
  Gamepad2,
  Globe,
  HardDrive,
  Laptop,
  type LucideIcon,
  Network,
  Package,
  Phone,
  Plug,
  Printer,
  Router,
  Server,
  ShieldCheck,
  Wifi,
} from "lucide-react"

/**
 * Maps a live catalogue category onto the line icon used in the home rail.
 *
 * Category names come from the ERP and do not match the Figma's mockup labels,
 * so we match on keywords rather than exact strings. Rules are ordered — the
 * first match wins — so specific patterns must sit above generic ones.
 * Anything unmatched falls back to a neutral icon rather than rendering a
 * misleading one.
 *
 * Covers the current live categories: Computers And Laptops, Gaming Pc & Case,
 * Home Smart Security, Ip Products, It Accessories, Networking, Pos, Power
 * Supply, Printer & Scanners, Security Devices, Server And Storage. The
 * networking rules below that cover the Figma's labels and likely future
 * categories.
 */
const ICON_RULES: ReadonlyArray<readonly [RegExp, LucideIcon]> = [
  [/server|rack/i, Server],
  [/printer|scanner/i, Printer],
  [/power\s*supply|ups|psu|battery/i, Plug],
  [/gaming|gamer|console/i, Gamepad2],
  [/computer|laptop|notebook|desktop|pc\b/i, Laptop],
  [/point\s*of\s*sale|\bpos\b/i, CreditCard],
  [/cctv|surveillance|camera|smart\s*security/i, Cctv],
  [/firewall/i, BrickWall],
  [/security/i, ShieldCheck],
  [/ip\s*(product|phone|cam)|telephon|voip|pbx|phone/i, Phone],
  [/accessor|adapter|module|card/i, CircuitBoard],
  [/network|switch/i, Network],
  [/router|gateway/i, Router],
  [/wireless|wi-?fi|bridge|access\s*point/i, Wifi],
  [/storage|nas|disk|drive/i, HardDrive],
  [/optical|fib(er|re)|transceiver|sfp/i, Globe],
  [/cable|patch|cord/i, Cable],
]

export const iconForCategory = (name: string): LucideIcon =>
  ICON_RULES.find(([pattern]) => pattern.test(name))?.[1] ?? Package
