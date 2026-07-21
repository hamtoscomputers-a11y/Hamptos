"use client"

import { Menu } from "lucide-react"
import { Link } from "react-router-dom"
import mainLogo from "@/assets/mainLogo.png"
import { CONTACT } from "@/components/header/navigation"
import {
  ADDRESS_LINES,
  FOOTER_NAV,
  IT_SERVICES,
  OUR_PRODUCTS,
  SOCIAL_LINKS,
} from "@/components/footer/footerLinks"

const DASHED = "border-b border-dashed border-ink-faint"

const ColumnHeading = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-5 text-lg font-bold text-brand-700">{children}</h4>
)

const BulletLink = ({ label, href }: { label: string; href: string }) => (
  <li className="flex gap-2 text-sm leading-relaxed text-ink-slate">
    <span aria-hidden>•</span>
    <Link to={href} className="transition-colors hover:text-brand-700">
      {label}
    </Link>
  </li>
)

const Footer = () => (
  <footer className="bg-white">
    <div className="container mx-auto px-4">
      {/* The logo and the category rail are one vertical auto-layout in the
          Figma — 147 tall overall with a 19px gap between them, each closing
          on its own dashed rule. */}
      <div className="flex flex-col gap-[19px]">
        <div className={`flex justify-center py-3 ${DASHED}`}>
          <Link to="/" aria-label="Hamtos home">
            <img src={mainLogo} alt="Hamtos" className="h-10 w-auto md:h-[63px]" />
          </Link>
        </div>

        {/* Category rail */}
        <nav aria-label="Footer categories" className={`pb-2.5 pt-2 ${DASHED}`}>
          {/* The rail reads grey, with only "All Categories" carrying colour. */}
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-ink-stone">
            <li className="flex items-center gap-2 font-semibold text-brand-800">
              {/* The icon is black in the Figma; only the label is blue. */}
              <Menu size={18} aria-hidden className="text-black" />
              All Categories
            </li>
            {FOOTER_NAV.map(({ label, href }) => (
              <li key={label}>
                <Link to={href} className="transition-colors hover:text-brand-700">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Social */}
      <div className={`py-5 ${DASHED}`}>
        <ul className="flex flex-wrap items-center justify-center gap-x-[29px] gap-y-3">
          {SOCIAL_LINKS.map(({ name, icon, url }) => (
            <li key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-6 items-center gap-2 text-sm leading-6 text-ink-soft transition-colors hover:text-brand-700"
              >
                <img src={icon} alt="" aria-hidden className="h-4 w-4" />
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Detail columns */}
      <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 lg:grid-cols-3">
        <div>
          <ColumnHeading>Contact Address</ColumnHeading>
          <address className="space-y-1 text-sm not-italic leading-relaxed text-ink-slate">
            <p className="font-semibold">Hamtos, E-Store</p>
            {ADDRESS_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              Tel:{" "}
              <a href={CONTACT.phoneHref} className="hover:text-brand-700">
                {CONTACT.phone}
              </a>
            </p>
            <p>
              Email:{" "}
              <a href={CONTACT.emailHref} className="hover:text-brand-700">
                {CONTACT.email}
              </a>
            </p>
          </address>
        </div>

        <div>
          <ColumnHeading>Our Products</ColumnHeading>
          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <ul className="space-y-2">
              {OUR_PRODUCTS.slice(0, 6).map((item) => (
                <BulletLink key={item.label} {...item} />
              ))}
            </ul>
            <ul className="space-y-2">
              {OUR_PRODUCTS.slice(6).map((item) => (
                <BulletLink key={item.label} {...item} />
              ))}
            </ul>
          </div>
        </div>

        <div>
          <ColumnHeading>IT Services</ColumnHeading>
          <ul className="space-y-2">
            {IT_SERVICES.map((service) => (
              <li key={service} className="flex gap-2 text-sm leading-relaxed text-ink-slate">
                <span aria-hidden>•</span>
                {service}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Legal bar */}
    <div className="bg-[#E1E1E1] py-4">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-xs text-ink-muted sm:flex-row">
        <p>Copyright ©2022 Hamtos, All Rights Reserved.</p>
        <div className="flex items-center gap-3">
          <Link to="/privacy-policy" className="hover:text-brand-700">
            Privacy Policy
          </Link>
          <span aria-hidden className="text-ink-faint">
            |
          </span>
          <Link to="/terms-and-conditions" className="hover:text-brand-700">
            Terms and Conditions
          </Link>
          <span aria-hidden className="text-ink-faint">
            |
          </span>
          <Link to="/terms-and-conditions" className="hover:text-brand-700">
            Site Map
          </Link>
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
