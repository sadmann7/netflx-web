import type { PlansConfig } from "@/types"
import { Laptop, Phone, Tablet, Tv2 } from "lucide-react"

export const plansConfig: PlansConfig = {
  perks: [
    "Watch on your phone, tablet, laptop, and TV",
    "Unlimited movies and TV shows",
    "Change or cancel your plan anytime",
  ],
  plans: [
    {
      title: "Mobile",
      price: 2.99,
      videoQuality: "Good",
      resolution: "480p",
      devices: [
        {
          title: "Phone",
          icon: Phone,
        },
        {
          title: "Tablet",
          icon: Tablet,
        },
      ],
    },
    {
      title: "Basic",
      price: 3.99,
      videoQuality: "Good",
      resolution: "720p",
      devices: [
        {
          title: "Phone",
          icon: Phone,
        },
        {
          title: "Tablet",
          icon: Tablet,
        },
        {
          title: "Computer",
          icon: Laptop,
        },
      ],
    },
    {
      title: "Standard",
      price: 7.99,
      videoQuality: "Better",
      resolution: "1080p",
      devices: [
        {
          title: "Phone",
          icon: Phone,
        },
        {
          title: "Tablet",
          icon: Tablet,
        },
        {
          title: "Computer",
          icon: Laptop,
        },
        {
          title: "TV",
          icon: Tv2,
        },
      ],
    },
    {
      title: "Premium",
      price: 9.99,
      videoQuality: "Best",
      resolution: "4K+HDR",
      devices: [
        {
          title: "Phone",
          icon: Phone,
        },
        {
          title: "Tablet",
          icon: Tablet,
        },
        {
          title: "Computer",
          icon: Laptop,
        },
        {
          title: "TV",
          icon: Tv2,
        },
      ],
    },
  ],
}
