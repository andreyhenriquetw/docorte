import React from "react"
import { getConcludedBookings } from "../_data/get-concluided-bookings"

const Financials = async () => {
  const concludedBookings = await getConcludedBookings()
  const totalRevenue = concludedBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )
  const averageTicket =
    concludedBookings.length > 0 ? totalRevenue / concludedBookings.length : 0

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Financeiro</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Receita finalizada</p>
          <p className="text-lg font-bold">R$ {totalRevenue.toFixed(2)}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Ticket médio</p>
          <p className="text-lg font-bold">R$ {averageTicket.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default Financials
