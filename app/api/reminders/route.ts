import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export async function GET() {
  try {
    const now = toZonedTime(new Date(), "America/Sao_Paulo")

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
      const bookingDate = toZonedTime(booking.date, "America/Sao_Paulo")

      const minutes = (bookingDate.getTime() - now.getTime()) / 1000 / 60

      console.log({
        cliente: booking.user.name,
        agora: now.toISOString(),
        agendamento: bookingDate.toISOString(),
        faltam: minutes,
      })

      return minutes >= 28 && minutes <= 30
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
