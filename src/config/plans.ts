import type { PlansConfig } from "@/types"

import { Icons } from "@/components/icons"

export const plansConfig: PlansConfig = {
  perks: [
    "Watch on your phone, tablet, laptop, and TV",
    "Unlimited movies and TV shows",
    "Change or cancel your plan anytime",
  ],
  plans: [
    {
      name: "Mobile",
      price: 2.99,
      videoQuality: "Good",
      resolution: "480p",
      devices: [
        {
          title: "Phone",
          icon: Icons.phone,
        },
        {
          title: "Tablet",
          icon: Icons.tablet,
        },
      ],
    },
    {
      name: "Basic",
      price: 3.99,
      videoQuality: "Good",
      resolution: "720p",
      devices: [
        {
          title: "Phone",
          icon: Icons.phone,
        },
        {
          title: "Tablet",
          icon: Icons.tablet,
        },
        {
          title: "Computer",
          icon: Icons.computer,
        },
      ],
    },
    {
      name: "Standard",
      price: 7.99,
      videoQuality: "Better",
      resolution: "1080p",
      devices: [
        {
          title: "Phone",
          icon: Icons.phone,
        },
        {
          title: "Tablet",
          icon: Icons.tablet,
        },
        {
          title: "Computer",
          icon: Icons.computer,
        },
        {
          title: "TV",
          icon: Icons.tv,
        },
      ],
    },
    {
      name: "Premium",
      price: 9.99,
      videoQuality: "Best",
      resolution: "4K+HDR",
      devices: [
        {
          title: "Phone",
          icon: Icons.phone,
        },
        {
          title: "Tablet",
          icon: Icons.tablet,
        },
        {
          title: "Computer",
          icon: Icons.computer,
        },
        {
          title: "TV",
          icon: Icons.tv,
        },
      ],
    },
  ],
}
