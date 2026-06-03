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

    return NextResponse.json(
      bookings.map((booking) => {
        const diffMinutes = (booking.date.getTime() - now.getTime()) / 1000 / 60

        return {
          cliente: booking.user.name,
          utc: booking.date,
          diffMinutes,
        }
      }),
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar lembretes" },
      { status: 500 },
    )
  }
}
