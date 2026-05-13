import { db } from "@/app/_lib/prisma"
import BookingDetailsDialog from "./_components/booking-details-dialog"

import { CalendarDays, Clock3, User2, BellRing } from "lucide-react"

const AppointmentsPage = async () => {
  const bookings = await db.booking.findMany({
    include: {
      user: true,
      service: true,
    },

    orderBy: {
      date: "asc",
    },
  })

  const now = new Date()

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

  const upcomingBookings = bookings.filter((booking) => booking.date >= now)

  const todayBookings = upcomingBookings.filter((booking) =>
    isSameDay(booking.date, today),
  )

  const tomorrowBookings = upcomingBookings.filter((booking) =>
    isSameDay(booking.date, tomorrow),
  )

  const nextBooking = upcomingBookings[0]

  const uniqueClients = new Set(bookings.map((booking) => booking.user.id)).size

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>

          <p className="text-zinc-400">Gerencie os horários da barbearia.</p>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-medium text-white transition-all hover:scale-[1.02]">
          Novo Agendamento
        </button>
      </div>

      {/* ALERTA */}
      {todayBookings.length > 0 && (
        <div className="flex items-center gap-4 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-zinc-950 p-5">
          <div className="rounded-2xl bg-emerald-500/20 p-3">
            <BellRing size={24} className="text-emerald-400" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Você possui {todayBookings.length} agendamento(s) hoje
            </h2>

            <p className="text-sm text-emerald-300">
              Confira os próximos horários abaixo.
            </p>
          </div>
        </div>
      )}

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Hoje */}
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Hoje</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {todayBookings.length}
              </h2>
            </div>

            <CalendarDays className="text-emerald-400" />
          </div>
        </div>

        {/* Amanhã */}
        <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Amanhã</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {tomorrowBookings.length}
              </h2>
            </div>

            <Clock3 className="text-blue-400" />
          </div>
        </div>

        {/* Clientes */}
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Clientes</p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                {uniqueClients}
              </h2>
            </div>

            <User2 className="text-purple-400" />
          </div>
        </div>

        {/* Próximo */}
        <div className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-zinc-950 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Próximo Horário</p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                {nextBooking
                  ? nextBooking.date.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </h2>
            </div>

            <BellRing className="text-yellow-400" />
          </div>
        </div>
      </div>

      {/* PRÓXIMOS AGENDAMENTOS */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/60">
        <div className="flex items-center justify-between border-b border-zinc-800 p-6">
          <div>
            <h2 className="text-xl font-bold text-white">
              Próximos Agendamentos
            </h2>

            <p className="text-sm text-zinc-400">
              Agenda organizada por horário.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-2">
            <span className="text-sm font-medium text-zinc-300">
              {upcomingBookings.length} próximos
            </span>
          </div>
        </div>

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
                {/* glow */}
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
                  {/* esquerda */}
                  <div className="flex items-center gap-5">
                    {/* horário */}
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

                    {/* infos */}
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

                      <p className="text-base text-zinc-300">
                        {booking.service.name}
                      </p>

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

                  {/* ações */}
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
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 py-20">
              <CalendarDays size={60} className="mb-5 text-zinc-700" />

              <h3 className="text-xl font-semibold text-zinc-300">
                Nenhum agendamento futuro
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Novos agendamentos aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppointmentsPage
