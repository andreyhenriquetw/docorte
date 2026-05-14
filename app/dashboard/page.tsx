import React from "react"
import Overview from "./overview"
import Appointments from "./appointments"
import Clients from "./clients"

import Reports from "./reports"
import DailySummary from "./daily-summary"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { notFound } from "next/navigation"

const Dashboard = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      {/* topo */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>

        <p className="text-zinc-400">
          Gerencie sua barbearia e acompanhe resultados.
        </p>
      </div>

      {/* cards métricas */}
      <Overview />

      {/* grid principal */}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
        {/* esquerda */}
        <div className="space-y-6">
          <Appointments />
          <Reports />
        </div>

        {/* direita */}
        <div className="space-y-6">
          <DailySummary />

          <Clients />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
