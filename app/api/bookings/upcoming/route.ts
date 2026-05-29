import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const thirtyMinutesLater = new Date(now.getTime() + 60 * 60 * 1000)

    const bookings = await db.booking.findMany({
      where: {
        reminderSent: false,

        status: "CONFIRMED",

        date: {
          gte: now,
          lte: thirtyMinutesLater,
        },
      },

      include: {
        user: true,

        service: {
          include: {
            barbershop: true,
          },
        },

        barber: true,
      },
    })

    const filteredBookings = bookings.filter((booking) => {
      const diff = booking.date.getTime() - now.getTime()

      const minutes = diff / 1000 / 60

      return minutes >= 0 && minutes <= 999
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
