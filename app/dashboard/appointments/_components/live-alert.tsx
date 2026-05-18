"use client"

import { useEffect, useMemo, useState } from "react"
import { BellRing } from "lucide-react"

interface Booking {
  id: string
  date: Date
}

interface LiveAlertProps {
  bookings: Booking[]
}

const LiveAlert = ({ bookings }: LiveAlertProps) => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return new Date(booking.date) >= currentTime
    })
  }, [bookings, currentTime])

  if (activeBookings.length === 0) {
    return null
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-zinc-950 p-5 shadow-lg shadow-emerald-950/20">
      {/* brilho animado */}
      <div className="absolute inset-0 animate-[ping_2s_ease-in-out_infinite] bg-emerald-400/5" />

      <div className="relative flex items-center gap-4">
        {/* ícone */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-emerald-400/30" />

          <div className="relative rounded-2xl bg-emerald-500/20 p-3">
            <BellRing size={24} className="text-emerald-400" />
          </div>
        </div>

        {/* texto */}
        <div>
          <h2 className="text-lg font-semibold text-white">
            Você possui {activeBookings.length} agendamento(s) hoje
          </h2>

          <p className="text-sm text-emerald-300">
            Confira os próximos horários abaixo.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LiveAlert
