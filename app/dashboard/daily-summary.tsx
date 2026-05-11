import React from "react"
import { isToday } from "date-fns"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluided-bookings"

const DailySummary = async () => {
  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()
  const todayConfirmed = confirmedBookings.filter((booking) =>
    isToday(booking.date),
  )
  const todayConcluded = concludedBookings.filter((booking) =>
    isToday(booking.date),
  )
  const expectedRevenue = todayConfirmed.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Resumo Diário</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Hoje</p>
          <p className="text-lg font-bold">{todayConfirmed.length}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Finalizados hoje</p>
          <p className="text-lg font-bold">{todayConcluded.length}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Previsão</p>
          <p className="text-lg font-bold">R$ {expectedRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default DailySummary
