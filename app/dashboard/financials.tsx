import React from "react"
import { getDashboardBookings } from "./_data/get-dashboard-bookings"

import {
  DollarSign,
  Wallet,
  CalendarDays,
  Scissors,
  Users,
  ArrowUpRight,
} from "lucide-react"

const Financials = async () => {
  const bookings = await getDashboardBookings()

  const now = new Date()

  // AGENDAMENTOS DO MÊS
  const monthlyBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)

    return (
      bookingDate.getMonth() === now.getMonth() &&
      bookingDate.getFullYear() === now.getFullYear()
    )
  })

  // FATURAMENTO TOTAL
  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  // FATURAMENTO MENSAL
  const monthlyRevenue = monthlyBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  // TICKET MÉDIO
  const averageTicket =
    monthlyBookings.length > 0 ? monthlyRevenue / monthlyBookings.length : 0

  // CLIENTES ÚNICOS
  const uniqueClients = new Set(
    monthlyBookings.map((booking) => booking.user.id),
  ).size

  // SERVIÇO MAIS AGENDADO
  const servicesRanking = monthlyBookings.reduce<
    Record<
      string,
      {
        total: number
        revenue: number
      }
    >
  >((acc, booking) => {
    const serviceName = booking.service.name

    if (!acc[serviceName]) {
      acc[serviceName] = {
        total: 0,
        revenue: 0,
      }
    }

    acc[serviceName].total += 1

    acc[serviceName].revenue += Number(booking.service.price)

    return acc
  }, {})

  const topService = Object.entries(servicesRanking).sort(
    (a, b) => b[1].total - a[1].total,
  )[0]

  // AGENDAMENTOS HOJE
  const todayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)

    return (
      bookingDate.getDate() === now.getDate() &&
      bookingDate.getMonth() === now.getMonth() &&
      bookingDate.getFullYear() === now.getFullYear()
    )
  })

  // FATURAMENTO HOJE
  const todayRevenue = todayBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  return (
    <div
      id="financials"
      className="rounded-[32px] border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Financeiro</h2>

          <p className="text-sm text-zinc-500">
            Resumo financeiro em tempo real
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 p-3">
          <Wallet className="text-emerald-400" size={24} />
        </div>
      </div>

      {/* FATURAMENTO PRINCIPAL */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-5 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-emerald-100">Faturamento do mês</p>

            <h3 className="mt-2 text-4xl font-bold text-white">
              R${" "}
              {monthlyRevenue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>

          <DollarSign className="text-white" size={34} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-emerald-100">Hoje</p>

            <h4 className="mt-2 text-2xl font-bold text-white">
              R${" "}
              {todayRevenue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h4>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-emerald-100">Ticket Médio</p>

            <h4 className="mt-2 text-2xl font-bold text-white">
              R${" "}
              {averageTicket.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h4>
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="mt-5 grid gap-4">
        {/* AGENDAMENTOS */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Agendamentos do mês</p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                {monthlyBookings.length}
              </h3>
            </div>

            <div className="rounded-2xl bg-purple-500/10 p-3">
              <CalendarDays className="text-purple-400" size={22} />
            </div>
          </div>
        </div>

        {/* CLIENTES */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Clientes ativos</p>

              <h3 className="mt-2 text-3xl font-bold text-white">
                {uniqueClients}
              </h3>
            </div>

            <div className="rounded-2xl bg-blue-500/10 p-3">
              <Users className="text-blue-400" size={22} />
            </div>
          </div>
        </div>

        {/* SERVIÇO TOP */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Serviço mais agendado</p>

              <h3 className="mt-2 text-xl font-bold text-white">
                {topService ? topService[0] : "Nenhum"}
              </h3>
            </div>

            <div className="rounded-2xl bg-yellow-500/10 p-3">
              <Scissors className="text-yellow-400" size={22} />
            </div>
          </div>

          {topService && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-3">
                <span className="text-sm text-zinc-400">Agendamentos</span>

                <span className="font-bold text-white">
                  {topService[1].total}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-3">
                <span className="text-sm text-zinc-400">Receita</span>

                <span className="font-bold text-emerald-400">
                  R${" "}
                  {topService[1].revenue.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOTAL GERAL */}
      <div className="mt-5 rounded-3xl border border-zinc-800 bg-zinc-950/90 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Receita total geral</p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-400">
              R${" "}
              {totalRevenue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </h3>
          </div>

          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <ArrowUpRight className="text-emerald-400" size={24} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Financials
