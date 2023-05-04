/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    // image optimization is disabled because of exceeding the vercel hobby tier limit
    unoptimized: true,
    domains: ["image.tmdb.org", "res.cloudinary.com"],
  },

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */

  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },

  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
}
export default config
