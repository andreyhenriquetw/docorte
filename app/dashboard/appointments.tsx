"use client"

import React, { useEffect, useMemo, useState } from "react"

import LiveDashboardAppointments from "./live-dashboard-appointments"

interface Booking {
  id: string

  date: Date

  user: {
    name: string | null
    email: string
  }

  service: {
    name: string
    price: number
  }

  status: string
}

interface AppointmentsProps {
  bookings: Booking[]
}

const Appointments = ({ bookings }: AppointmentsProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // REMOVE AGENDAMENTOS PASSADOS EM TEMPO REAL
  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return new Date(booking.date) >= currentTime
    })
  }, [bookings, currentTime])

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
          {activeBookings.length} agendamento(s)
        </span>
      </div>

      <LiveDashboardAppointments bookings={activeBookings} />
    </div>
  )
}

export default Appointments
