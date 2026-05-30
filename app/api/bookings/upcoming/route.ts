import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    console.log("AGORA:", now.toISOString())

    const bookings = await db.booking.findMany({
      where: {
        reminderSent: false,
        status: "CONFIRMED",
      },

      include: {
        user: true,
        service: true,
      },
    })

    bookings.forEach((booking) => {
      const diff = booking.date.getTime() - now.getTime()

      const minutes = diff / 1000 / 60

      console.log(
        "BOOKING:",
        booking.id,
        "DATA:",
        booking.date.toISOString(),
        "MINUTOS:",
        minutes,
      )
    })

    const filteredBookings = bookings.filter((booking) => {
      const diff = booking.date.getTime() - now.getTime()
      const minutes = diff / 1000 / 60

      console.log("BOOKING:", booking.id, "MINUTOS:", minutes)

      return minutes >= 29 && minutes <= 30
    })

    return NextResponse.json(filteredBookings)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao buscar agendamentos",
      },
      {
        status: 500,
      },
    )
  }
}
