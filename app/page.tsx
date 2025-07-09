import { redirect } from "next/navigation"
import { SessionManager } from "@/lib/oauth/server"
import LoginPage from "@/components/login-page"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; details?: string }>
}) {
  const session = await SessionManager.getSession()

  if (session) {
    redirect("/dashboard")
  }

  const params = await searchParams
  return <LoginPage error={params.error} details={params.details} />
}
