"use client"

import { useState } from "react"

import { formatInTimeZone } from "date-fns-tz"

interface Booking {
  id: string

  date: Date

  user: {
    name: string | null
  }

  service: {
    name: string
    price: number
  }

  barber: {
    name: string
  } | null
}

interface FinishedBookingsModalProps {
  bookings: Booking[]
}

const FinishedBookingsModal = ({ bookings }: FinishedBookingsModalProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-zinc-950 px-5 py-3 font-medium text-white transition-all hover:scale-[1.02] hover:border-red-500/40 hover:from-red-500/20"
      >
        Finalizados
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-red-500/20 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 shadow-2xl shadow-red-950/20">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-5">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Agendamentos Finalizados
                </h2>

                <p className="text-sm text-zinc-400">
                  Histórico de atendimentos
                </p>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-zinc-950 px-4 py-2 text-white transition-all hover:border-red-500/40 hover:from-red-500/20"
              >
                Fechar
              </button>
            </div>

            <div className="space-y-4">
              {bookings.length === 0 && (
                <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-10 text-center text-zinc-500">
                  Nenhum agendamento finalizado.
                </div>
              )}

              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-red-500/10 bg-gradient-to-br from-red-500/[0.06] via-zinc-900 to-zinc-950 p-5 transition-all hover:border-red-500/30 hover:from-red-500/[0.10]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white">
                        {booking.user.name}
                      </h3>

                      <p className="text-sm text-zinc-300">
                        {booking.service.name}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                        <span>
                          Data:{" "}
                          {formatInTimeZone(
                            booking.date,
                            "America/Sao_Paulo",
                            "dd/MM/yyyy",
                          )}
                        </span>

                        <span>
                          Hora:{" "}
                          {formatInTimeZone(
                            booking.date,
                            "America/Sao_Paulo",
                            "HH:mm",
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-right">
                      <div>
                        <p className="text-sm text-zinc-500">Barbeiro</p>

                        <p className="font-medium text-white">
                          {booking.barber?.name ?? "Não informado"}
                        </p>
                      </div>

                      <p className="text-lg font-bold text-emerald-400">
                        R$ {Number(booking.service.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FinishedBookingsModal
