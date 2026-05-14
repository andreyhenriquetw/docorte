import { db } from "@/app/_lib/prisma"

import { CalendarDays, Clock3, User2, BellRing } from "lucide-react"

import { toZonedTime } from "date-fns-tz"

import LiveAlert from "./_components/live-alert"
import LiveAppointmentsList from "./_components/live-appointments-list"

const AppointmentsPage = async () => {
  const bookings = await db.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      service: true,

      barber: {
        select: {
          id: true,
          name: true,
          specialty: true,
        },
      },
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

      {/* ALERTA AO VIVO */}
      <LiveAlert bookings={todayBookings} />

      {/* CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* HOJE */}
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

        {/* AMANHÃ */}
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

        {/* CLIENTES */}
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

        {/* PRÓXIMO */}
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

        <LiveAppointmentsList bookings={upcomingBookings} />
      </div>
    </div>
  )
}

export default AppointmentsPage
