import { redirect } from "next/navigation"
import { SessionManager } from "@/lib/oauth/server"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const session = await SessionManager.getSession()

  if (!session) {
    redirect("/")
  }

  return <Dashboard user={session.user} session={session} />
}
