import React from "react"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const Appointments = async () => {
  const confirmedBookings = await getConfirmedBookings()

  return (
    <div className="rounded-lg bg-card p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Agendamentos</h2>
      {confirmedBookings.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Você não possui agendamentos confirmados.
        </p>
      )}
      <ul className="space-y-2">
        {confirmedBookings.map((booking) => (
          <li key={booking.id} className="rounded border p-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{booking.service.name}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.service.barbershop.name}
                </p>
              </div>
              <p className="text-sm font-semibold">
                R$ {Number(booking.service.price).toFixed(2)}
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {format(booking.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Appointments
