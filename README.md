# [Netflx OTT](https://netflx-web.vercel.app/)

This is a Netflix clone project built with the [T3 Stack](https://create.t3.gg/) and bootstrapped with `create-t3-app`.

[![Netflx OTT](./public/screenshot.png)](https://netflx-web.vercel.app/)

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Stripe](https://stripe.com)

## Features

- Authentication with NextAuth.js
- Subscription with Stripe
- Profile creation for individual users with rsc, tRPC, and Prisma
- Pin verfication for profies

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sadmann7/netflx-web
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory and add the environment variables as shown in the `.env.example` file.

### 4. Run the application

```bash
yarn run dev
```

### 5. Listen for stripe events

```bash
yarn run stripe:listen
```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
