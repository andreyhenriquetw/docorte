import { db } from "@/app/_lib/prisma"

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Users,
} from "lucide-react"

import ExportReportButton from "./_components/export-report-button"
import ServicesChart from "./_components/services-chart"

type ServiceRanking = {
  name: string
  total: number
  quantity: number
}

const formatCurrency = (value: number) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const FinancialsPage = async () => {
  const bookings = await db.booking.findMany({
    include: {
      user: true,
      service: true,
    },

    orderBy: {
      date: "desc",
    },
  })

  const now = new Date()

  const currentMonth = now.getMonth()

  const currentYear = now.getFullYear()

  const monthBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)

    return (
      bookingDate.getMonth() === currentMonth &&
      bookingDate.getFullYear() === currentYear
    )
  })

  const totalRevenue = monthBookings.reduce((acc, booking) => {
    return acc + Number(booking.service.price)
  }, 0)

  const totalBookings = monthBookings.length

  const averageTicket = totalBookings > 0 ? totalRevenue / totalBookings : 0

  const todayBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)

    return (
      bookingDate.getDate() === now.getDate() &&
      bookingDate.getMonth() === now.getMonth() &&
      bookingDate.getFullYear() === now.getFullYear()
    )
  })

  const todayRevenue = todayBookings.reduce((acc, booking) => {
    return acc + Number(booking.service.price)
  }, 0)

  const servicesRanking: ServiceRanking[] = Object.values(
    monthBookings.reduce<Record<string, ServiceRanking>>((acc, booking) => {
      const serviceName = booking.service.name

      if (!acc[serviceName]) {
        acc[serviceName] = {
          name: serviceName,
          total: 0,
          quantity: 0,
        }
      }

      acc[serviceName].total += Number(booking.service.price)

      acc[serviceName].quantity += 1

      return acc
    }, {}),
  ).sort((a, b) => b.total - a.total)

  const topService = servicesRanking[0] || null

  const uniqueClients = new Set(monthBookings.map((booking) => booking.user.id))
    .size

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Financeiro</h1>

          <p className="text-zinc-400">
            Controle financeiro completo da sua barbearia.
          </p>
        </div>

        <ExportReportButton
          totalRevenue={totalRevenue}
          totalBookings={totalBookings}
          averageTicket={averageTicket}
          uniqueClients={uniqueClients}
          servicesRanking={servicesRanking}
        />
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* FATURAMENTO */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Faturamento Mensal</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {formatCurrency(totalRevenue)}
              </h2>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <Wallet className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* HOJE */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Faturamento Hoje</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {formatCurrency(todayRevenue)}
              </h2>
            </div>

            <div className="rounded-2xl bg-blue-500/10 p-3">
              <TrendingUp className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* TICKET */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Ticket Médio</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {formatCurrency(averageTicket)}
              </h2>
            </div>

            <div className="rounded-2xl bg-purple-500/10 p-3">
              <DollarSign className="text-purple-400" />
            </div>
          </div>
        </div>

        {/* CLIENTES */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Clientes no Mês</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {uniqueClients}
              </h2>
            </div>

            <div className="rounded-2xl bg-yellow-500/10 p-3">
              <Users className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        {/* RELATÓRIO */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <BarChart3 className="text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Desempenho Financeiro
              </h2>

              <p className="text-sm text-zinc-500">
                Receita baseada nos agendamentos do sistema.
              </p>
            </div>
          </div>

          {/* FATURAMENTO TOTAL */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">Faturamento Total</p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  {formatCurrency(totalRevenue)}
                </h2>
              </div>

              <div className="rounded-3xl bg-emerald-500/10 p-4">
                <Wallet size={32} className="text-emerald-400" />
              </div>
            </div>

            <div className="mt-6">
              <ServicesChart data={servicesRanking} />
            </div>

            <div className="mt-6 grid gap-3">
              {servicesRanking.slice(0, 4).map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-2xl bg-zinc-950/60 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        index === 0
                          ? "bg-emerald-500"
                          : index === 1
                            ? "bg-blue-500"
                            : index === 2
                              ? "bg-yellow-500"
                              : "bg-purple-500"
                      }`}
                    />

                    <div>
                      <h3 className="font-medium text-white">{service.name}</h3>

                      <p className="text-sm text-zinc-500">
                        {service.quantity} agendamento(s)
                      </p>
                    </div>
                  </div>

                  <h2 className="font-bold text-emerald-400">
                    {formatCurrency(service.total)}
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LATERAL */}
        <div className="space-y-6">
          {/* SERVIÇO TOP */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-yellow-500/10 p-3">
                <TrendingUp className="text-yellow-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Serviço Destaque
                </h2>

                <p className="text-sm text-zinc-500">Serviço mais lucrativo.</p>
              </div>
            </div>

            {topService ? (
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6">
                <h3 className="text-2xl font-bold text-white">
                  {topService.name}
                </h3>

                <p className="mt-2 text-sm text-emerald-100">
                  Serviço mais solicitado atualmente.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm text-emerald-100">Receita</p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {formatCurrency(topService.total)}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <p className="text-sm text-emerald-100">Agendamentos</p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {topService.quantity}
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-zinc-500">Nenhum dado encontrado.</div>
            )}
          </div>

          {/* RESUMO */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-red-500/10 p-3">
                <TrendingDown className="text-red-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">Resumo</h2>

                <p className="text-sm text-zinc-500">Dados rápidos do mês.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4">
                <span className="text-zinc-400">Agendamentos</span>

                <span className="font-semibold text-white">
                  {totalBookings}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4">
                <span className="text-zinc-400">Serviços ativos</span>

                <span className="font-semibold text-white">
                  {servicesRanking.length}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4">
                <span className="text-zinc-400">Média diária</span>

                <span className="font-semibold text-white">
                  {formatCurrency(
                    totalBookings > 0
                      ? totalRevenue /
                          new Set(
                            monthBookings.map((booking) =>
                              new Date(booking.date).toDateString(),
                            ),
                          ).size
                      : 0,
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4">
                <span className="text-zinc-400">Atualizado</span>

                <span className="font-semibold text-white">Hoje</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialsPage
