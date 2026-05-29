import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000)

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

        service: true,

        barber: true,
      },
    })

    return NextResponse.json(bookings)
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
