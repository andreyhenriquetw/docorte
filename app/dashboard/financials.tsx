import React from "react"
import { getDashboardBookings } from "./_data/get-dashboard-bookings"
import { DollarSign, TrendingUp } from "lucide-react"

const Financials = async () => {
  const bookings = await getDashboardBookings()

  const totalRevenue = bookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  const averageTicket = bookings.length > 0 ? totalRevenue / bookings.length : 0

  return (
    <div
      id="financials"
      className="rounded-[32px] border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Financeiro</h2>

        <DollarSign className="text-emerald-500" size={22} />
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-zinc-950 p-4">
          <p className="text-sm text-zinc-500">Receita total</p>

          <h3 className="mt-2 text-2xl font-bold text-emerald-400">
            R$ {totalRevenue.toFixed(2)}
          </h3>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Ticket médio</p>

              <h3 className="mt-2 text-xl font-bold text-white">
                R$ {averageTicket.toFixed(2)}
              </h3>
            </div>

            <TrendingUp size={22} className="text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Financials
