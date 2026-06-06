import { addMinutes } from "date-fns"
import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { formatInTimeZone } from "date-fns-tz"

export async function GET() {
  try {
    const now = new Date()
    const windowEnd = addMinutes(now, 60)
    const nowSaoPaulo = formatInTimeZone(
      now,
      "America/Sao_Paulo",
      "yyyy-MM-dd HH:mm:ssXXX",
    )

    const bookings = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,
        date: {
          gte: now,
          lte: windowEnd,
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
      const bookingDate = new Date(booking.date)
      const diffMinutes = (bookingDate.getTime() - now.getTime()) / 1000 / 60

      console.log({
        cliente: booking.user.name,
        agendamentoUTC: bookingDate.toISOString(),
        agendamentoSP: formatInTimeZone(
          bookingDate,
          "America/Sao_Paulo",
          "yyyy-MM-dd HH:mm:ssXXX",
        ),
        agoraUTC: now.toISOString(),
        agoraSP: nowSaoPaulo,
        minutosRestantes: Math.round(diffMinutes),
      })

      // dispara entre 28 e 32 minutos antes
      return diffMinutes >= 28 && diffMinutes <= 40
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
