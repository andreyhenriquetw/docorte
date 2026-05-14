"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"

import { Prisma } from "@prisma/client"

import { CalendarDays, Clock3, DollarSign, Scissors, User2 } from "lucide-react"

interface BarberBooking {
  id: string
  date: Date
  status: string

  user: {
    name: string | null
  }

  service: {
    name: string
    price: Prisma.Decimal | number
  }
}

interface BarberDetailsDialogProps {
  barber: {
    id: string
    name: string
    specialty: string | null
    imageUrl?: string | null

    totalRevenue: number
    totalBookings: number

    bookings: BarberBooking[]
  }
}

const BarberDetailsDialog = ({ barber }: BarberDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="mt-4 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:border-emerald-500 hover:bg-zinc-800">
          Ver detalhes
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-[#09090b] text-white sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {barber.name}
          </DialogTitle>

          <p className="text-sm text-zinc-400">
            Histórico completo de atendimentos
          </p>
        </DialogHeader>

        {/* RESUMO */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <p className="text-sm text-zinc-300">Faturamento</p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {barber.totalRevenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </h2>
          </div>

          <div className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5">
            <p className="text-sm text-zinc-300">Agendamentos</p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {barber.totalBookings}
            </h2>
          </div>
        </div>

        {/* LISTA */}
        <div className="mt-6 space-y-4">
          {barber.bookings.map((booking) => {
            const bookingDate = new Date(booking.date)

            return (
              <div
                key={booking.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <User2 size={18} className="text-emerald-400" />

                      <h3 className="text-lg font-bold text-white">
                        {booking.user.name || "Cliente"}
                      </h3>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-zinc-400">
                      <Scissors size={16} />

                      <span>{booking.service.name}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />

                        <span>{bookingDate.toLocaleDateString("pt-BR")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock3 size={15} />

                        <span>
                          {bookingDate.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-emerald-500/10 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-emerald-400" />

                        <span className="font-bold text-emerald-400">
                          {Number(booking.service.price).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {booking.status === "CANCELED" ? (
                      <div className="rounded-2xl bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400">
                        Cancelado
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
                        Confirmado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BarberDetailsDialog
