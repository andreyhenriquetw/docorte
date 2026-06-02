import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const bookings = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,
      },

      include: {
        user: true,
        service: true,
        barber: true,
      },
    })

    const reminders = bookings.filter((booking) => {
      const diff = booking.date.getTime() - now.getTime()

      const minutes = diff / 1000 / 60

      // janela de segurança
      return minutes >= 25 && minutes <= 30
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
