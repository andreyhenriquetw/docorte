import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const bookings = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,
        date: {
          gte: now,
        },
      },

      include: {
        user: true,
        service: true,
        barber: true,
      },

      orderBy: {
        date: "asc",
      },
    })

    const reminders = bookings.filter((booking) => {
      const diffMinutes = (booking.date.getTime() - now.getTime()) / 1000 / 60

      return diffMinutes <= 140
    })

    return NextResponse.json(reminders)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar lembretes" },
      { status: 500 },
    )
  }
}
