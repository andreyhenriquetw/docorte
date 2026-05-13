import React from "react"
import { getDashboardBookings } from "./_data/get-dashboard-bookings"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarDays, Clock3, DollarSign, Users } from "lucide-react"

const Overview = async () => {
  const allBookings = await getDashboardBookings()

  // faturamento do dia
  const dailyRevenue = allBookings
    .filter((booking) => isToday(booking.date))
    .reduce((total, booking) => total + Number(booking.service.price), 0)

  // faturamento total
  const totalRevenue = allBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  // clientes únicos
  const uniqueClients = new Set(allBookings.map((booking) => booking.userId))
    .size

  // próximo agendamento
  const nextBooking = allBookings[0]

  const cards = [
    {
      title: "Faturamento",
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      subtitle: `Hoje: R$ ${dailyRevenue.toFixed(2)}`,
    },
    {
      title: "Agendamentos",
      value: allBookings.length.toString(),
      icon: CalendarDays,
      subtitle: "Total",
    },
    {
      title: "Clientes",
      value: uniqueClients.toString(),
      icon: Users,
      subtitle: "Únicos",
    },
    {
      title: "Próximo horário",
      value: nextBooking
        ? format(nextBooking.date, "HH:mm", { locale: ptBR })
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
            className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-lg transition hover:border-emerald-500/20 hover:bg-zinc-900"
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
