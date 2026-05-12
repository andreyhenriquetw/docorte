import React from "react"
import { getDashboardBookings } from "./_data/get-dashboard-bookings"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cancelBooking } from "../_actions/cancel-booking"

const getUserColor = (email?: string) => {
  const colors = [
    "text-red-500",
    "text-blue-500",
    "text-green-500",
    "text-purple-500",
    "text-pink-500",
    "text-yellow-500",
    "text-cyan-500",
    "text-orange-500",
    "text-lime-500",
    "text-indigo-500",
  ]

  if (!email) return "text-gray-500"

  let hash = 0

  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

const Appointments = async () => {
  const confirmedBookings = await getDashboardBookings()

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Próximos Agendamentos</h2>

      {confirmedBookings.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Você não possui agendamentos confirmados.
        </p>
      )}

      <ul className="space-y-3">
        {confirmedBookings.map((booking) => (
          <li key={booking.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{booking.service.name}</p>

                <p
                  className={`mt-2 text-xs font-semibold ${getUserColor(
                    booking.user?.email,
                  )}`}
                >
                  Cliente: {booking.user?.name || "Sem nome"}
                </p>

                <p className="text-xs text-muted-foreground">
                  {booking.user?.email}
                </p>
              </div>

              <p className="text-sm font-semibold">
                R$ {Number(booking.service.price).toFixed(2)}
              </p>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {format(booking.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>

            <form
              action={async () => {
                "use server"
                await cancelBooking(booking.id)
              }}
              className="mt-3"
            >
              <button
                type="submit"
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Cancelar agendamento
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Appointments
