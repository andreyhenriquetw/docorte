import React from "react"
import Overview from "./overview"
import Appointments from "./appointments"
import Clients from "./clients"
import Financials from "./financials"
import Reports from "./reports"
import DailySummary from "./daily-summary"
import Header from "../_components/header"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"

const Dashboard = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return notFound()
  }

  return (
    <>
      <Header />
      <div className="space-y-6 p-5">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe seus agendamentos e resultados.
          </p>
        </div>
        <Overview />
        <DailySummary />
        <Appointments />
        <Financials />
        <Clients />
        <Reports />
      </div>
    </>
  )
}

export default Dashboard
