import { db } from "@/app/_lib/prisma"

import Link from "next/link"

import {
  Users,
  UserPlus,
  CalendarDays,
  Mail,
  TrendingUp,
  UserX,
  PieChart,
} from "lucide-react"

import SearchClients from "./_components/search-clients"

interface ClientsPageProps {
  searchParams: {
    search?: string
    page?: string
  }
}

const ClientsPage = async ({ searchParams }: ClientsPageProps) => {
  const search = searchParams.search || ""

  const currentPage = Number(searchParams.page || 1)

  const itemsPerPage = 10

  const users = await db.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    include: {
      bookings: true,
    },

    orderBy: {
      bookings: {
        _count: "desc",
      },
    },
  })

  const totalClients = users.length

  const activeClients = users.filter((user) => user.bookings.length > 0).length

  const inactiveClients = users.filter(
    (user) => user.bookings.length === 0,
  ).length

  const newClients = users.filter((user) => {
    const now = new Date()

    const diff = now.getTime() - new Date(user.createdAt).getTime()

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    return days <= 30
  }).length

  const totalBookings = users.reduce(
    (acc, user) => acc + user.bookings.length,
    0,
  )

  const totalPages = Math.ceil(users.length / itemsPerPage)

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const topClient = users[0]

  const activePercentage =
    totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0

  const inactivePercentage =
    totalClients > 0 ? Math.round((inactiveClients / totalClients) * 100) : 0

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>

          <p className="text-zinc-400">
            Gerencie os clientes da sua barbearia.
          </p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-medium text-white transition-all hover:scale-[1.02]">
          Novo Cliente
        </button>
      </div>

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Total Clientes</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {totalClients}
              </h2>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <Users className="text-emerald-400" />
            </div>
          </div>
        </div>

        {/* ATIVOS */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Clientes Ativos</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {activeClients}
              </h2>
            </div>

            <div className="rounded-2xl bg-blue-500/10 p-3">
              <TrendingUp className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* NOVOS */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Novos Clientes</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {newClients}
              </h2>
            </div>

            <div className="rounded-2xl bg-purple-500/10 p-3">
              <UserPlus className="text-purple-400" />
            </div>
          </div>
        </div>

        {/* AGENDAMENTOS */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">Agendamentos</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {totalBookings}
              </h2>
            </div>

            <div className="rounded-2xl bg-yellow-500/10 p-3">
              <CalendarDays className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/60">
        {/* HEADER TABELA */}
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Lista de Clientes
            </h2>

            <p className="text-sm text-zinc-500">
              Clientes com mais agendamentos aparecem primeiro.
            </p>
          </div>

          <SearchClients />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-zinc-800 bg-zinc-900/40">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                  Cliente
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                  Agendamentos
                </th>

                <th className="px-6 py-4 text-left text-sm font-medium text-zinc-400">
                  Cadastro
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-zinc-800 transition-all hover:bg-zinc-900/40"
                >
                  {/* CLIENTE */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-lg font-bold text-white">
                        {user.name?.charAt(0)}
                      </div>

                      <div>
                        <h3 className="font-medium text-white">{user.name}</h3>

                        <p className="text-sm text-zinc-500">Cliente</p>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Mail size={16} />

                      {user.email}
                    </div>
                  </td>

                  {/* BOOKINGS */}
                  <td className="px-6 py-5">
                    <div className="inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                      {user.bookings.length} agendamento(s)
                    </div>
                  </td>

                  {/* DATA */}
                  <td className="px-6 py-5 text-zinc-400">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {paginatedUsers.length === 0 && (
            <div className="p-10 text-center text-zinc-500">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>

        {/* PAGINAÇÃO */}
        <div className="relative flex items-center justify-center border-t border-zinc-800 p-5">
          <div className="absolute left-5 text-sm text-zinc-500">
            Página {currentPage} de {totalPages}
          </div>

          <div className="flex items-center gap-2">
            {Array.from({
              length: totalPages,
            }).map((_, index) => {
              const page = index + 1

              return (
                <Link
                  key={page}
                  href={`?page=${page}${search ? `&search=${search}` : ""}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all ${
                    currentPage === page
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {page}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* RELATÓRIOS */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* ESTATÍSTICAS */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3">
              <PieChart className="text-emerald-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Relatório de Clientes
              </h2>

              <p className="text-sm text-zinc-500">
                Estatísticas da base de clientes.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* ATIVOS */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-zinc-300">Clientes ativos</span>

                <span className="text-sm font-semibold text-white">
                  {activePercentage}%
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${activePercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* INATIVOS */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-zinc-300">Sem agendamento</span>

                <span className="text-sm font-semibold text-white">
                  {inactivePercentage}%
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{
                    width: `${inactivePercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* NOVOS */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-zinc-300">Novos clientes</span>

                <span className="text-sm font-semibold text-white">
                  {newClients}
                </span>
              </div>

              <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{
                    width: `${newClients * 10}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CLIENTE VIP */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-yellow-500/10 p-3">
              <TrendingUp className="text-yellow-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Cliente Destaque
              </h2>

              <p className="text-sm text-zinc-500">
                Cliente com mais agendamentos.
              </p>
            </div>
          </div>

          {topClient ? (
            <>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-3xl font-bold text-white">
                  {topClient.name?.charAt(0)}
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {topClient.name}
                  </h3>

                  <p className="text-zinc-400">{topClient.email}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-500">Agendamentos</p>

                  <h2 className="mt-2 text-3xl font-bold text-emerald-400">
                    {topClient.bookings.length}
                  </h2>
                </div>

                <div className="rounded-2xl bg-zinc-900 p-4">
                  <p className="text-sm text-zinc-500">Status</p>

                  <div className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
                    Cliente VIP
                  </div>
                </div>
              </div>

              {/* SEM AGENDAMENTO */}
              <div className="mt-6 rounded-3xl border border-red-500/10 bg-red-500/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-red-500/10 p-3">
                    <UserX className="text-red-400" />
                  </div>

                  <div>
                    <p className="text-sm text-zinc-400">
                      Clientes sem agendamento
                    </p>

                    <h2 className="text-3xl font-bold text-white">
                      {inactiveClients}
                    </h2>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-zinc-500">Nenhum cliente encontrado.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientsPage
