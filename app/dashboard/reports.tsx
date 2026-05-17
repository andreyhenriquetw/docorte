"use client"

import { useEffect, useMemo, useState } from "react"

import { BarChart3, Crown, Scissors, Users } from "lucide-react"

interface Booking {
  id: string

  user: {
    id: string
    name: string | null
    email: string
  }

  service: {
    name: string
    price: number
  }
}

interface ReportsProps {
  bookings: Booking[]
}

const ITEMS_PER_PAGE = 5

const Reports = ({ bookings }: ReportsProps) => {
  const [page, setPage] = useState(1)

  // serviços
  const serviceStats = useMemo(() => {
    return bookings.reduce<
      Record<
        string,
        {
          count: number
          revenue: number
        }
      >
    >((acc, booking) => {
      const serviceName = booking.service.name

      if (!acc[serviceName]) {
        acc[serviceName] = {
          count: 0,
          revenue: 0,
        }
      }

      acc[serviceName].count += 1
      acc[serviceName].revenue += Number(booking.service.price)

      return acc
    }, {})
  }, [bookings])

  const sortedServices = useMemo(() => {
    return Object.entries(serviceStats)
      .map(([name, data]) => ({
        name,
        ...data,
      }))
      .sort((a, b) => b.count - a.count)
  }, [serviceStats])

  const topService = sortedServices[0]

  // clientes
  const clientStats = useMemo(() => {
    return bookings.reduce<
      Record<
        string,
        {
          name: string
          email: string
          count: number
        }
      >
    >((acc, booking) => {
      const userId = booking.user.id

      if (!acc[userId]) {
        acc[userId] = {
          name: booking.user.name ?? "Sem nome",
          email: booking.user.email,
          count: 0,
        }
      }

      acc[userId].count += 1

      return acc
    }, {})
  }, [bookings])

  const topClients = useMemo(() => {
    return Object.values(clientStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [clientStats])

  // paginação
  const totalPages = Math.ceil(sortedServices.length / ITEMS_PER_PAGE)

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE

    return sortedServices.slice(start, end)
  }, [sortedServices, page])

  useEffect(() => {
    if (page > totalPages) {
      setPage(1)
    }
  }, [page, totalPages])

  return (
    <div className="rounded-[32px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Relatórios</h2>

          <p className="text-sm text-zinc-400">Estatísticas dos agendamentos</p>
        </div>

        <BarChart3 className="text-zinc-500" size={22} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* CORTE MAIS AGENDADO */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-yellow-500/10 p-3">
              <Crown className="text-yellow-500" size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-white">Corte Mais Agendado</h3>

              <p className="text-sm text-zinc-500">Serviço campeão</p>
            </div>
          </div>

          {topService ? (
            <>
              <h2 className="text-2xl font-bold text-white">
                {topService.name}
              </h2>

              <p className="mt-2 text-zinc-400">
                {topService.count} agendamentos
              </p>
            </>
          ) : (
            <p className="text-zinc-500">Sem dados</p>
          )}
        </div>

        {/* CLIENTES TOP */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-500/10 p-3">
              <Users className="text-blue-500" size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-white">Top Clientes</h3>

              <p className="text-sm text-zinc-500">Quem mais agenda</p>
            </div>
          </div>

          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div
                key={client.email}
                className="flex items-center justify-between rounded-2xl bg-zinc-900 p-3"
              >
                <div>
                  <p className="font-medium text-white">
                    #{index + 1} {client.name}
                  </p>

                  <p className="text-xs text-zinc-500">{client.email}</p>
                </div>

                <span className="rounded-xl bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                  {client.count} ag.
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-950/50 p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <Scissors className="text-emerald-500" size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-white">Serviços</h3>

            <p className="text-sm text-zinc-500">Relatório de cortes</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full">
            <thead className="bg-zinc-900">
              <tr className="text-left text-sm text-zinc-400">
                <th className="p-4">Serviço</th>

                <th className="p-4">Agendamentos</th>

                <th className="p-4">Receita</th>
              </tr>
            </thead>

            <tbody>
              {paginatedServices.map((service) => (
                <tr key={service.name} className="border-t border-zinc-800">
                  <td className="p-4 text-white">{service.name}</td>

                  <td className="p-4 text-zinc-400">{service.count}</td>

                  <td className="p-4 font-medium text-emerald-400">
                    R$ {service.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`h-10 w-10 rounded-xl text-sm font-medium transition ${
                    page === index + 1
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports
