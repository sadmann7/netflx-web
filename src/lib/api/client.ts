"use client"

import {
  createHydrateClient,
  createTRPCNextBeta,
} from "@/@trpc/next-layout/client"
import { type AppRouter } from "@/server/api/root"
import { httpBatchLink, loggerLink } from "@trpc/client"
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server"
import superjson from "superjson"

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "" // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

/*
 * Create a client that can be used in the client only
 */

export const api = createTRPCNextBeta<AppRouter>({
  transformer: superjson,
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: false,
        cacheTime: Infinity,
        staleTime: Infinity,
      },
    },
  },
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
    }),
  ],
})

/*
 * A component used to hydrate the state from server to client
 */

export const HydrateClient = createHydrateClient({
  transformer: superjson,
})

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
