"use client"

import type { PropsWithChildren } from "react"

import { api } from "@/lib/api/client"

const TRPCProvider = ({ children }: PropsWithChildren) => {
  return <api.Provider>{children}</api.Provider>
}

export default TRPCProvider
