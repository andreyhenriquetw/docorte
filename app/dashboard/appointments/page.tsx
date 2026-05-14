import { db } from "@/app/_lib/prisma"
import BookingDetailsDialog from "./_components/booking-details-dialog"
import LiveAppointmentsAlert from "./_components/live-alert"

import { CalendarDays, Clock3, User2, BellRing } from "lucide-react"
import { toZonedTime } from "date-fns-tz"

const AppointmentsPage = async () => {
  const bookings = await db.booking.findMany({
    include: {
      user: true,
      service: true,
      barber: true,
    },

    orderBy: {
      date: "asc",
    },
  })

  const now = toZonedTime(new Date(), "America/Sao_Paulo")

  const today = toZonedTime(new Date(), "America/Sao_Paulo")

  const tomorrow = new Date(today)

  tomorrow.setDate(today.getDate() + 1)

  const isSameDay = (date1: Date, date2: Date) => {
    const zonedDate1 = toZonedTime(date1, "America/Sao_Paulo")

    const zonedDate2 = toZonedTime(date2, "America/Sao_Paulo")

    return (
      zonedDate1.getDate() === zonedDate2.getDate() &&
      zonedDate1.getMonth() === zonedDate2.getMonth() &&
      zonedDate1.getFullYear() === zonedDate2.getFullYear()
    )
  }

  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = toZonedTime(booking.date, "America/Sao_Paulo")

    return bookingDate >= now
  })

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

      {/* ALERTA DINÂMICO */}
      <LiveAppointmentsAlert todayBookings={todayBookings} />

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
                  ? toZonedTime(
                      nextBooking.date,
                      "America/Sao_Paulo",
                    ).toLocaleTimeString("pt-BR", {
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
            const bookingDate = toZonedTime(booking.date, "America/Sao_Paulo")

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
                <div className="relative flex flex-col gap-6 p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-5">
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

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-white">
                          {booking.user.name}
                        </h3>
                      </div>

                      <div className="space-y-1">
                        <p className="text-base text-zinc-300">
                          {booking.service.name}
                        </p>

                        <p className="text-sm text-emerald-400">
                          Barbeiro: {booking.barber?.name || "Não definido"}
                        </p>
                      </div>

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
        </div>
      </div>
    </div>
  )
}

export default AppointmentsPage
