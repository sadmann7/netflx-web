import type { Icon, MEDIA_TYPE, Profile, User } from "@prisma/client"

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type NavItem = {
  title: string
  href?: string
  onClick?: () => void
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  mainNav: NavItem[]
  profileDropdownItems: NavItem[]
  footerItems: NavItem[]
  socialLinks: NavItem[]
}

export type PlansConfig = {
  perks: string[]
  plans: {
    name: "Mobile" | "Basic" | "Standard" | "Premium"
    price: number
    videoQuality: "Good" | "Better" | "Best"
    resolution: "480p" | "720p" | "1080p" | "4K+HDR"
    devices: {
      title: "Phone" | "Tablet" | "Computer" | "TV"
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    }[]
  }[]
}

export type Genre = {
  id: number
  name: string | null
}

export type VideoType =
  | "Bloopers"
  | "Featurette"
  | "Behind the Scenes"
  | "Clip"
  | "Trailer"
  | "Teaser"

export type Show = {
  adult: boolean
  backdrop_path: string
  media_type: MEDIA_TYPE
  belongs_to_collection: null
  budget: number
  genres: Genre[]
  genre_ids: number[] | null
  homepage: string
  id: number
  imdb_id: string | null
  original_language: string
  overview: string | null
  popularity: number
  poster_path: string | null
  production_companies: {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }[]
  production_countries: {
    iso_3166_1: string
    name: string
  }[]
  number_of_seasons?: number
  number_of_episodes?: number
  episode_run_time?: number[]
  seasons?: {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path: string
    season_number: number
  }[]
  release_date: string
  first_air_date?: string
  last_air_date?: string
  revenue: number
  runtime: number | null
  spoken_languages: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status: string
  tagline: string | null
  title: string | null
  original_title: string | null
  name: string | null
  video: boolean
  videos?: {
    results: {
      iso_639_1: string
      iso_3166_1: string
      name: string
      key: string
      site: string
      size: number
      type: VideoType
      official: boolean
      published_at: string
      id: string
    }[]
  }
  vote_average: number
  vote_count: number
}

export type CategorizedShows = {
  title: string
  shows?: Show[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
  monthlyPrice?: number
  videoQuality?: string
  resolution?: string
  devices?: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number
  }

export type ProfileWithIcon = Profile & {
  icon: Icon
}

export type PickedIcon = Pick<Icon, "id" | "title" | "href">

export type PickedProfile = Pick<
  Profile,
  "id" | "name" | "language" | "gameHandle"
> & {
  icon: PickedIcon
}
