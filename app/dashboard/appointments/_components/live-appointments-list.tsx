"use client"

import { useEffect, useMemo, useState } from "react"

import BookingDetailsDialog from "./booking-details-dialog"

import { CalendarDays, Clock3 } from "lucide-react"

interface Booking {
  id: string

  date: Date

  status: string

  user: {
    name: string | null
    email: string
  }

  service: {
    name: string
  }

  barber: {
    name: string
    specialty: string | null
  } | null
}

interface LiveAppointmentsListProps {
  bookings: Booking[]
}

const LiveAppointmentsList = ({ bookings }: LiveAppointmentsListProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const upcomingBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return new Date(booking.date) >= currentTime
    })
  }, [bookings, currentTime])

  const today = new Date()

  const tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  return (
    <div className="space-y-4 p-6">
      {upcomingBookings.map((booking) => {
        const bookingDate = new Date(booking.date)

        const isToday = isSameDay(bookingDate, today)

        const isTomorrow = isSameDay(bookingDate, tomorrow)

        const formattedDate = bookingDate.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "2-digit",
          month: "long",
        })

        const formattedHour = bookingDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })

        return (
          <div
            key={booking.id}
            className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 hover:scale-[1.01] ${
              isToday
                ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-zinc-950"
                : isTomorrow
                  ? "border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-zinc-950"
                  : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
            }`}
          >
            <div
              className={`absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl ${
                isToday
                  ? "bg-emerald-500/10"
                  : isTomorrow
                    ? "bg-blue-500/10"
                    : "bg-zinc-700/10"
              }`}
            />

            <div className="relative flex flex-col gap-6 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div
                  className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-3xl border ${
                    isToday
                      ? "border-emerald-500/30 bg-emerald-500/10"
                      : isTomorrow
                        ? "border-blue-500/30 bg-blue-500/10"
                        : "border-zinc-700 bg-zinc-900"
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider text-zinc-500">
                    Hora
                  </span>

                  <span className="mt-1 text-2xl font-bold text-white">
                    {formattedHour}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">
                      {booking.user.name}
                    </h3>

                    {isToday ? (
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                        Hoje
                      </span>
                    ) : isTomorrow ? (
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
                        Amanhã
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                        Próximo
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-base text-zinc-300">
                      {booking.service.name}
                    </p>

                    <p className="text-sm text-emerald-400">
                      Barbeiro: {booking.barber?.name || "Não definido"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1 text-sm text-zinc-500">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />

                      <span className="capitalize">{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />

                      <span>{formattedHour}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BookingDetailsDialog booking={booking} />

                {booking.status === "CANCELED" ? (
                  <div className="rounded-2xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400">
                    Cancelado
                  </div>
                ) : (
                  <div className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
                    Confirmado
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {upcomingBookings.length === 0 && (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
          <h2 className="text-lg font-semibold text-white">
            Nenhum agendamento restante
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Todos os horários de hoje já passaram.
          </p>
        </div>
      )}
    </div>
  )
}

export default LiveAppointmentsList
