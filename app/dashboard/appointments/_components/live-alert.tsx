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
    <div className="flex items-center gap-4 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-zinc-950 p-5">
      <div className="rounded-2xl bg-emerald-500/20 p-3">
        <BellRing size={24} className="text-emerald-400" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white">
          Você possui {activeBookings.length} agendamento(s) hoje
        </h2>

        <p className="text-sm text-emerald-300">
          Confira os próximos horários abaixo.
        </p>
      </div>
    </div>
  )
}

export default LiveAlert
