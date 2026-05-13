"use client"

import { useState, useTransition } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"

import { Button } from "@/app/_components/ui/button"

import { useRouter } from "next/navigation"

import { cancelBooking } from "@/app/_actions/cancel-booking"

interface BookingDetailsDialogProps {
  booking: {
    id: string

    user: {
      name: string | null
      email: string
    }

    service: {
      name: string
    }

    date: Date

    status: string
  }
}

const BookingDetailsDialog = ({ booking }: BookingDetailsDialogProps) => {
  const [open, setOpen] = useState(false)

  const [loading, startTransition] = useTransition()

  const router = useRouter()

  const handleCancelBooking = () => {
    startTransition(async () => {
      await cancelBooking(booking.id)

      router.refresh()

      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-800">
          Detalhes
        </button>
      </DialogTrigger>

      <DialogContent className="border-zinc-800 bg-[#09090b] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* cliente */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-sm text-zinc-500">Cliente</p>

            <h3 className="mt-1 text-lg font-semibold">{booking.user.name}</h3>

            <p className="text-sm text-zinc-400">{booking.user.email}</p>
          </div>

          {/* serviço */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <p className="text-sm text-zinc-500">Serviço</p>

            <h3 className="mt-1 text-lg font-semibold">
              {booking.service.name}
            </h3>
          </div>

          {/* data */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-sm text-zinc-500">Data</p>

              <h3 className="mt-1 font-semibold">
                {booking.date.toLocaleDateString("pt-BR")}
              </h3>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
              <p className="text-sm text-zinc-500">Horário</p>

              <h3 className="mt-1 font-semibold">
                {booking.date.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
            </div>
          </div>

          {/* cancelar */}
          {booking.status !== "CANCELED" && (
            <Button
              variant="destructive"
              className="w-full"
              disabled={loading}
              onClick={handleCancelBooking}
            >
              {loading ? "Cancelando..." : "Cancelar Agendamento"}
            </Button>
          )}

          {booking.status === "CANCELED" && (
            <div className="rounded-2xl bg-red-500/20 px-4 py-3 text-center text-sm font-semibold text-red-400">
              Este agendamento foi cancelado
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookingDetailsDialog
