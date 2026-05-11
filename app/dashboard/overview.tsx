import React from "react"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluided-bookings"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"

const Overview = async () => {
  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()

  const dailyRevenue = concludedBookings
    .filter((booking) => isToday(booking.date))
    .reduce((total, booking) => total + Number(booking.service.price), 0)
  const totalRevenue = concludedBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )
  const totalBookings = confirmedBookings.length + concludedBookings.length
  const nextBooking = confirmedBookings[0]

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Visão Geral</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-primary p-4 text-primary-foreground">
          <p className="text-sm">Faturamento Diário</p>
          <p className="text-lg font-bold">R$ {dailyRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-secondary p-4 text-secondary-foreground">
          <p className="text-sm">Total de Agendamentos</p>
          <p className="text-lg font-bold">{totalBookings}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Faturamento Total</p>
          <p className="text-lg font-bold">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Próximo Horário</p>
          <p className="text-lg font-bold">
            {nextBooking
              ? format(nextBooking.date, "dd/MM 'às' HH:mm", { locale: ptBR })
              : "Sem agenda"}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Overview
