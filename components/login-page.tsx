"use client"

import { Suspense } from "react"
import MultiProviderLogin from "./multi-provider-login"

interface LoginPageProps {
  error?: string
  details?: string
}

export default function LoginPage({ error, details }: LoginPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiProviderLogin error={error} details={details} />
    </Suspense>
  )
}