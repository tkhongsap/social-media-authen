import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("line-session")

  if (!session) {
    redirect("/")
  }

  const user = JSON.parse(session.value)

  return <Dashboard user={user} />
}
