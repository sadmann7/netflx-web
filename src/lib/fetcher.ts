import { env } from "@/env.mjs"
import type { MediaType, Show } from "@/types"

export const getShows = async (mediaType: MediaType) => {
  const [
    trendingShows,
    topRatedShows,
    netflixOriginals,
    actionShows,
    comedyShows,
    horrorShows,
    romanceShows,
    documentaries,
  ] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/trending/all/week?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    ),
    fetch(
      `https://api.themoviedb.org/3/${mediaType}/top_rated?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&with_networks=213`
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=28`
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=35`
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=27`
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=10749`
    ),
    fetch(
      `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=99`
    ),
  ])

  if (
    !trendingShows.ok ||
    !topRatedShows.ok ||
    !netflixOriginals.ok ||
    !actionShows.ok ||
    !comedyShows.ok ||
    !horrorShows.ok ||
    !romanceShows.ok ||
    !documentaries.ok
  ) {
    throw new Error("Failed to fetch data")
  }

  const [trending, topRated, netflix, action, comedy, horror, romance, docs] =
    (await Promise.all([
      trendingShows.json(),
      topRatedShows.json(),
      netflixOriginals.json(),
      actionShows.json(),
      comedyShows.json(),
      horrorShows.json(),
      romanceShows.json(),
      documentaries.json(),
    ])) as { results: Show[] }[]

  return {
    trending: trending?.results,
    topRated: topRated?.results,
    netflix: netflix?.results,
    action: action?.results,
    comedy: comedy?.results,
    horror: horror?.results,
    romance: romance?.results,
    docs: docs?.results,
  }
}
