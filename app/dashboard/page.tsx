import React from "react"

import Overview from "./overview"
import Appointments from "./appointments"
import Clients from "./clients"

import Reports from "./reports"
import DailySummary from "./daily-summary"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

import { notFound } from "next/navigation"

import { getDashboardBookings } from "./_data/get-dashboard-bookings"

import { getConfirmedBookings } from "../_data/get-confirmed-bookings"

import { getConcludedBookings } from "../_data/get-concluided-bookings"

export const dynamic = "force-dynamic"

const Dashboard = async () => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return notFound()
  }

  // BOOKINGS DASHBOARD
  const bookings = await getDashboardBookings()

  // BOOKINGS RESUMO
  const confirmedBookingsRaw = await getConfirmedBookings()

  const concludedBookingsRaw = await getConcludedBookings()

  const confirmedBookings = confirmedBookingsRaw.map((booking) => ({
    ...booking,

    service: {
      ...booking.service,

      price: Number(booking.service.price),
    },
  }))

  const concludedBookings = concludedBookingsRaw.map((booking) => ({
    ...booking,

    service: {
      ...booking.service,

      price: Number(booking.service.price),
    },
  }))

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
      <Overview bookings={bookings} />

      {/* grid principal */}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.8fr]">
        {/* esquerda */}
        <div className="space-y-6">
          <Appointments bookings={bookings} />

          <Reports bookings={bookings} />
        </div>

        {/* direita */}
        <div className="space-y-6">
          <DailySummary
            confirmedBookings={confirmedBookings}
            concludedBookings={concludedBookings}
          />

          <Clients />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
