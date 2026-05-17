"use client"

import { useEffect, useMemo, useState } from "react"

import { isToday } from "date-fns"

import { CalendarDays, Clock3, DollarSign, Users } from "lucide-react"

import { formatInTimeZone } from "date-fns-tz"

interface Booking {
  id: string

  date: Date

  userId: string

  user: {
    name: string | null
  }

  service: {
    price: number
  }
}

interface OverviewProps {
  bookings: Booking[]
}

const Overview = ({ bookings }: OverviewProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // REMOVE AGENDAMENTOS PASSADOS AUTOMATICAMENTE
  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return new Date(booking.date) >= currentTime
    })
  }, [bookings, currentTime])

  const dailyRevenue = bookings
    .filter((booking) => isToday(new Date(booking.date)))
    .reduce((total, booking) => total + Number(booking.service.price), 0)

  const totalRevenue = activeBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  const uniqueClients = new Set(activeBookings.map((booking) => booking.userId))
    .size

  const nextBooking = activeBookings[0]

  const cards = [
    {
      title: "Faturamento",

      value: `R$ ${totalRevenue.toFixed(2)}`,

      icon: DollarSign,

      subtitle: `Hoje: R$ ${dailyRevenue.toFixed(2)}`,
    },

    {
      title: "Agendamentos",

      value: activeBookings.length,

      icon: CalendarDays,

      subtitle: "Total",
    },

    {
      title: "Clientes",

      value: uniqueClients,

      icon: Users,

      subtitle: "Únicos",
    },

    {
      title: "Próximo horário",

      value: nextBooking
        ? formatInTimeZone(nextBooking.date, "America/Sao_Paulo", "HH:mm")
        : "--:--",

      icon: Clock3,

      subtitle: nextBooking?.user?.name ?? "Sem agenda",
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg transition hover:border-emerald-500/40 hover:bg-zinc-900"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="rounded-2xl bg-zinc-800 p-3">
                <Icon size={22} />
              </div>

              <span className="text-sm text-zinc-500">{card.subtitle}</span>
            </div>

            <p className="text-sm text-zinc-400">{card.title}</p>

            <h3 className="mt-2 text-3xl font-bold text-white">{card.value}</h3>
          </div>
        )
      })}
    </div>
  )
}

export default Overview
