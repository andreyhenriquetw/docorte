import React from "react"
import { isToday } from "date-fns"
import { CalendarCheck2, CircleDollarSign, Scissors } from "lucide-react"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluided-bookings"

const DailySummary = async () => {
  const confirmedBookings = await getConfirmedBookings()

  const concludedBookings = await getConcludedBookings()

  const todayConfirmed = confirmedBookings.filter((booking) =>
    isToday(booking.date),
  )

  const todayConcluded = concludedBookings.filter((booking) =>
    isToday(booking.date),
  )

  const expectedRevenue = todayConfirmed.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  const cards = [
    {
      title: "Hoje",
      value: todayConfirmed.length,
      icon: CalendarCheck2,
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Finalizados hoje",
      value: todayConcluded.length,
      icon: Scissors,
      color: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Previsão",
      value: `R$ ${expectedRevenue.toFixed(2)}`,
      icon: CircleDollarSign,
      color: "bg-yellow-500/10 border-yellow-500/20",
    },
  ]

  return (
    <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Resumo Diário</h2>

          <p className="text-sm text-zinc-400">
            Desempenho dos agendamentos de hoje
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-800 px-4 py-2 text-sm text-zinc-400">
          Hoje
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className={`rounded-3xl border p-4 transition hover:scale-[1.02] ${card.color}`}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="rounded-2xl bg-zinc-900 p-3">
                  <Icon size={22} />
                </div>
              </div>

              <p className="text-sm text-zinc-400">{card.title}</p>

              <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">
                {card.value}
              </h3>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailySummary
