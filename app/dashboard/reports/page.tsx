import { db } from "@/app/_lib/prisma"

import {
  BarChart3,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Users,
  Clock3,
  ArrowUpRight,
} from "lucide-react"

const ReportsPage = async () => {
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

  // AGENDAMENTOS DO MÊS
  const monthBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)

    return (
      bookingDate.getMonth() === now.getMonth() &&
      bookingDate.getFullYear() === now.getFullYear()
    )
  })

  // FATURAMENTO
  const totalRevenue = monthBookings.reduce(
    (acc, booking) => acc + Number(booking.service.price),
    0,
  )

  // CLIENTES
  const uniqueClients = new Set(monthBookings.map((booking) => booking.user.id))
    .size

  // TICKET MÉDIO
  const averageTicket =
    monthBookings.length > 0 ? totalRevenue / monthBookings.length : 0

  // SERVIÇOS
  const servicesRanking = Object.values(
    monthBookings.reduce<
      Record<
        string,
        {
          name: string
          total: number
          revenue: number
        }
      >
    >((acc, booking) => {
      const serviceName = booking.service.name

      if (!acc[serviceName]) {
        acc[serviceName] = {
          name: serviceName,
          total: 0,
          revenue: 0,
        }
      }

      acc[serviceName].total += 1

      acc[serviceName].revenue += Number(booking.service.price)

      return acc
    }, {}),
  ).sort((a, b) => b.total - a.total)

  // CLIENTES TOP
  const topClients = Object.values(
    monthBookings.reduce<
      Record<
        string,
        {
          name: string
          total: number
        }
      >
    >((acc, booking) => {
      const clientName = booking.user.name || "Cliente"

      if (!acc[clientName]) {
        acc[clientName] = {
          name: clientName,
          total: 0,
        }
      }

      acc[clientName].total += 1

      return acc
    }, {}),
  ).sort((a, b) => b.total - a.total)

  // HORÁRIO MAIS MOVIMENTADO
  const hoursRanking = Object.values(
    monthBookings.reduce<
      Record<
        string,
        {
          hour: string
          total: number
        }
      >
    >((acc, booking) => {
      const hour = booking.date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
      })

      if (!acc[hour]) {
        acc[hour] = {
          hour,
          total: 0,
        }
      }

      acc[hour].total += 1

      return acc
    }, {}),
  ).sort((a, b) => b.total - a.total)

  const busiestHour = hoursRanking[0]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Relatórios</h1>

          <p className="text-zinc-400">Estatísticas completas da barbearia.</p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-medium text-white transition-all hover:scale-[1.02]">
          Exportar Relatório
        </button>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* FATURAMENTO */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Receita Mensal</p>

              <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                R${" "}
                {totalRevenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <DollarSign className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* AGENDAMENTOS */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Agendamentos</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {monthBookings.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-blue-500/10 p-3">
              <CalendarDays className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* CLIENTES */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Clientes</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {uniqueClients}
              </h2>
            </div>

            <div className="rounded-2xl bg-purple-500/10 p-3">
              <Users className="text-purple-400" />
            </div>
          </div>
        </div>

        {/* TICKET */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Ticket Médio</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                R${" "}
                {averageTicket.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </h2>
            </div>

            <div className="rounded-2xl bg-yellow-500/10 p-3">
              <TrendingUp className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* SERVIÇOS */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <BarChart3 className="text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Serviços Mais Agendados
              </h2>

              <p className="text-sm text-zinc-500">
                Ranking baseado nos agendamentos.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {servicesRanking.map((service, index) => (
              <div
                key={service.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-sm font-bold text-emerald-400">
                      #{index + 1}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {service.name}
                      </h3>

                      <p className="text-sm text-zinc-500">
                        {service.total} agendamento(s)
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <h2 className="text-lg font-bold text-emerald-400">
                      R${" "}
                      {service.revenue.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </h2>
                  </div>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    style={{
                      width: `${
                        (service.total / servicesRanking[0].total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LATERAL */}
        <div className="space-y-6">
          {/* MELHOR HORÁRIO */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/10 p-3">
                <Clock3 className="text-blue-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Horário de Pico
                </h2>

                <p className="text-sm text-zinc-500">
                  Horário mais movimentado.
                </p>
              </div>
            </div>

            {busiestHour ? (
              <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-6">
                <h3 className="text-5xl font-bold text-white">
                  {busiestHour.hour}:00
                </h3>

                <p className="mt-3 text-blue-100">
                  {busiestHour.total} agendamento(s)
                </p>
              </div>
            ) : (
              <div className="text-zinc-500">Sem dados</div>
            )}
          </div>

          {/* CLIENTES */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-purple-500/10 p-3">
                <Users className="text-purple-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Clientes Frequentes
                </h2>

                <p className="text-sm text-zinc-500">Quem mais agenda.</p>
              </div>
            </div>

            <div className="space-y-3">
              {topClients.slice(0, 5).map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between rounded-2xl bg-zinc-900 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-bold text-purple-400">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-medium text-white">{client.name}</h3>

                      <p className="text-sm text-zinc-500">Cliente ativo</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-400">
                    <ArrowUpRight size={16} />

                    {client.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsPage
