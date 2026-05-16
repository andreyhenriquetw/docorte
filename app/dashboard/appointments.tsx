// app/dashboard/appointments.tsx

import React from "react"

import { getDashboardBookings } from "./_data/get-dashboard-bookings"

import LiveDashboardAppointments from "./live-dashboard-appointments"

const Appointments = async () => {
  const bookings = await getDashboardBookings()

  return (
    <div
      id="appointments"
      className="rounded-[32px] border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Próximos Agendamentos
          </h2>

          <p className="text-sm text-zinc-500">Agenda dos clientes</p>
        </div>

        <span className="rounded-xl bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
          {bookings.length} agendamentos
        </span>
      </div>

      <LiveDashboardAppointments bookings={bookings} />
    </div>
  )
}

export default Appointments
