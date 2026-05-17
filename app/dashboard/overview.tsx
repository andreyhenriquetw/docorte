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
    }, 10000)

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

      gradient: "from-emerald-500/20 via-emerald-400/10 to-green-600/5",
      border: "border-emerald-500/20",
      glow: "shadow-[0_0_40px_rgba(16,185,129,0.12)]",
      iconBg: "bg-gradient-to-br from-emerald-400 to-green-600",
    },

    {
      title: "Agendamentos",
      value: activeBookings.length,
      icon: CalendarDays,
      subtitle: "Total",

      gradient: "from-violet-500/20 via-fuchsia-500/10 to-purple-600/5",
      border: "border-violet-500/20",
      glow: "shadow-[0_0_40px_rgba(139,92,246,0.12)]",
      iconBg: "bg-gradient-to-br from-violet-500 to-fuchsia-500",
    },

    {
      title: "Clientes",
      value: uniqueClients,
      icon: Users,
      subtitle: "Únicos",

      gradient: "from-sky-500/20 via-cyan-500/10 to-blue-600/5",
      border: "border-sky-500/20",
      glow: "shadow-[0_0_40px_rgba(14,165,233,0.12)]",
      iconBg: "bg-gradient-to-br from-sky-500 to-cyan-500",
    },

    {
      title: "Próximo horário",
      value: nextBooking
        ? formatInTimeZone(nextBooking.date, "America/Sao_Paulo", "HH:mm")
        : "--:--",
      icon: Clock3,
      subtitle: nextBooking?.user?.name ?? "Sem agenda",

      gradient: "from-amber-500/20 via-orange-500/10 to-yellow-500/5",
      border: "border-amber-500/20",
      glow: "shadow-[0_0_40px_rgba(245,158,11,0.12)]",
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-[28px] border p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${card.border} ${card.glow} `}
          >
            {/* Background premium gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} `}
            />

            {/* Glow blur */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-5 flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg ${card.iconBg} `}
                >
                  <Icon size={24} />
                </div>

                <span className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-zinc-300">
                  {card.subtitle}
                </span>
              </div>

              <p className="text-sm font-medium tracking-wide text-zinc-400">
                {card.title}
              </p>

              <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                {card.value}
              </h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Overview
