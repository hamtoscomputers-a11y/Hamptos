import guarantee from "@/assets/gurantee.png"
import help from "@/assets/help.png"
import delivery from "@/assets/delivery.png"
import support from "@/assets/chatmessage.png"
import { CONTACT } from "@/components/header/navigation"

export interface ServiceFeature {
  icon: string
  title: string
  description: string
  /** Rendered after the title as a tel: link. */
  phone?: string
}

export const SERVICE_FEATURES: ServiceFeature[] = [
  {
    icon: guarantee,
    title: "Guarantee Products",
    description: "Top branded Products",
  },
  {
    icon: help,
    title: "NEED HELP?",
    description: "Call us for any Enquiry",
    phone: CONTACT.phone,
  },
  {
    icon: delivery,
    title: "Product Delivery",
    description: "Quick and Fast Delivery",
  },
  {
    icon: support,
    title: "Best Support",
    description: "Best Customer Support",
  },
]
