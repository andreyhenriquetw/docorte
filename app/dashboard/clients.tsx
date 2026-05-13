import React from "react"
import { getDashboardBookings } from "./_data/get-dashboard-bookings"
import { Users } from "lucide-react"

const Clients = async () => {
  const bookings = await getDashboardBookings()

  const uniqueClients = new Map()

  bookings.forEach((booking) => {
    if (booking.user) {
      uniqueClients.set(booking.user.id, booking.user)
    }
  })

  const clients = Array.from(uniqueClients.values()).slice(0, 5)

  return (
    <div
      id="clients"
      className="rounded-[32px] border border-zinc-800 bg-zinc-900/70 p-6 shadow-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Clientes</h2>

        <Users size={20} className="text-blue-400" />
      </div>

      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex items-center gap-3 rounded-2xl bg-zinc-950 p-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 font-bold text-white">
              {client.name?.charAt(0)}
            </div>

            <div>
              <h3 className="font-medium text-white">{client.name}</h3>

              <p className="text-sm text-zinc-500">{client.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Clients
