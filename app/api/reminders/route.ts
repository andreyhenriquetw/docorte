import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000)

    const reminders = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,

        date: {
          gt: now,
          lte: thirtyMinutesLater,
        },
      },

      include: {
        user: true,
        service: true,
        barber: true,
      },
    })

    return NextResponse.json(reminders)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao buscar lembretes",
      },
      {
        status: 500,
      },
    )
  }
}
