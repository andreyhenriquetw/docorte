// app/dashboard/live-dashboard-appointments.tsx

"use client"

import { useEffect, useMemo, useState } from "react"

import { isToday, isTomorrow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { formatInTimeZone } from "date-fns-tz"

import { cancelBooking } from "../_actions/cancel-booking"

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

interface LiveDashboardAppointmentsProps {
  bookings: Booking[]
}

const getUserColor = (email?: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-lime-500",
    "bg-indigo-500",
  ]

  if (!email) return "bg-zinc-500"

  let hash = 0

  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

const getStatus = (date: Date) => {
  if (isToday(date)) {
    return {
      label: "Hoje",
      color: "bg-emerald-500/20 text-emerald-400",
    }
  }

  if (isTomorrow(date)) {
    return {
      label: "Amanhã",
      color: "bg-blue-500/20 text-blue-400",
    }
  }

  return {
    label: "Agendado",
    color: "bg-yellow-500/20 text-yellow-400",
  }
}

const LiveDashboardAppointments = ({
  bookings,
}: LiveDashboardAppointmentsProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // REMOVE AUTOMATICAMENTE AGENDAMENTOS JÁ PASSADOS
  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return new Date(booking.date) >= currentTime
    })
  }, [bookings, currentTime])

  if (activeBookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 p-10 text-center text-zinc-500">
        Nenhum agendamento restante.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activeBookings.map((booking) => {
        const status = getStatus(new Date(booking.date))

        return (
          <div
            key={booking.id}
            className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5 transition hover:border-zinc-700 lg:flex-row lg:items-center lg:justify-between"
          >
            {/* esquerda */}
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white ${getUserColor(
                  booking.user?.email,
                )}`}
              >
                {booking.user?.name?.charAt(0) || "?"}
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {booking.user?.name || "Sem nome"}
                </h3>

                <p className="text-sm text-zinc-500">{booking.user?.email}</p>

                <p className="mt-1 text-sm text-zinc-300">
                  {booking.service.name}
                </p>
              </div>
            </div>

            {/* centro */}
            <div>
              <p className="text-sm text-zinc-500">Data</p>

              <p className="font-medium text-white">
                {formatInTimeZone(
                  booking.date,
                  "America/Sao_Paulo",
                  "dd/MM/yyyy 'às' HH:mm",
                  {
                    locale: ptBR,
                  },
                )}
              </p>
            </div>

            {/* status */}
            <div>
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${status.color}`}
              >
                {status.label}
              </span>
            </div>

            {/* preço */}
            <div>
              <p className="text-sm text-zinc-500">Valor</p>

              <p className="font-bold text-emerald-400">
                R$ {Number(booking.service.price).toFixed(2)}
              </p>
            </div>

            {/* botão */}
            <form
              action={async () => {
                await cancelBooking(booking.id)
              }}
            >
              <button
                type="submit"
                className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Cancelar
              </button>
            </form>
          </div>
        )
      })}
    </div>
  )
}

export default LiveDashboardAppointments
