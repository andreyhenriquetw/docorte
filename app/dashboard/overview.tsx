import React from "react"
import { getDashboardBookings } from "./_data/get-dashboard-bookings"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"

const Overview = async () => {
  const allBookings = await getDashboardBookings()

  const dailyRevenue = allBookings
    .filter((booking) => isToday(booking.date))
    .reduce((total, booking) => total + Number(booking.service.price), 0)

  const totalRevenue = allBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  const totalBookings = allBookings.length

  const nextBooking = allBookings[0]

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Visão Geral</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-zinc-900/50 p-4">
          <p className="text-sm">Faturamento Diário</p>

          <p className="text-lg font-bold">R$ {dailyRevenue.toFixed(2)}</p>
        </div>

        <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
          <p className="text-sm">Total de Agendamentos</p>

          <p className="text-lg font-bold">{totalBookings}</p>
        </div>

        <div className="rounded-lg border bg-emerald-600 p-4">
          <p className="text-sm">Faturamento Total</p>

          <p className="text-lg font-bold">R$ {totalRevenue.toFixed(2)}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Próximo Horário</p>

          {nextBooking ? (
            <>
              <p className="text-lg font-bold">
                {format(nextBooking.date, "dd/MM 'às' HH:mm", { locale: ptBR })}
              </p>

              <p className="mt-1 text-xs font-medium text-blue-500">
                {nextBooking.user?.name}
              </p>
            </>
          ) : (
            <p className="text-lg font-bold">Sem agenda</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
