import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LoginPage from "@/components/login-page"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; details?: string }>
}) {
  const cookieStore = await cookies()
  const session = cookieStore.get("line-session")

  if (session) {
    redirect("/dashboard")
  }

  const params = await searchParams
  return <LoginPage error={params.error} details={params.details} />
}
