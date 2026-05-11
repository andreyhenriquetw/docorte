import React from "react"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluided-bookings"

const Clients = async () => {
  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()
  const bookings = [...confirmedBookings, ...concludedBookings]
  const visitedBarbershops = new Set(
    bookings.map((booking) => booking.service.barbershop.id),
  )

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Clientes</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Reservas realizadas</p>
          <p className="text-lg font-bold">{bookings.length}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Barbearias visitadas</p>
          <p className="text-lg font-bold">{visitedBarbershops.size}</p>
        </div>
      </div>
    </div>
  )
}

export default Clients
