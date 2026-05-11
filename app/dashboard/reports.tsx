import React from "react"
import { getConcludedBookings } from "../_data/get-concluided-bookings"

const Reports = async () => {
  const concludedBookings = await getConcludedBookings()
  const serviceCount = concludedBookings.reduce<Record<string, number>>(
    (acc, booking) => {
      acc[booking.service.name] = (acc[booking.service.name] ?? 0) + 1
      return acc
    },
    {},
  )
  const topService = Object.entries(serviceCount).sort(
    (first, second) => second[1] - first[1],
  )[0]

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Relatórios</h2>
      <div className="rounded-lg border p-3">
        <p className="text-sm text-muted-foreground">Serviço mais finalizado</p>
        <p className="text-lg font-bold">
          {topService ? `${topService[0]} (${topService[1]})` : "Sem dados"}
        </p>
      </div>
    </div>
  )
}

export default Reports
