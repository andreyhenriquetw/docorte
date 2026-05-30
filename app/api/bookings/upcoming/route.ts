import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    console.log("AGORA UTC:", now.toISOString())

    const bookings = await db.booking.findMany({
      where: {
        reminderSent: false,
        status: "CONFIRMED",
      },

      include: {
        user: true,
        service: {
          include: {
            barbershop: true,
          },
        },
      },
    })

    const filteredBookings = bookings.filter((booking) => {
      const diffMs = booking.date.getTime() - now.getTime()

      const minutes = diffMs / 1000 / 60

      console.log({
        bookingId: booking.id,
        bookingUTC: booking.date.toISOString(),
        nowUTC: now.toISOString(),
        minutes,
      })

      return minutes >= 28 && minutes <= 31
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
