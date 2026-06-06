import { addMinutes } from "date-fns"
import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { formatInTimeZone } from "date-fns-tz"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const now = new Date()
    const reminderStart = addMinutes(now, 28)
    const reminderEnd = addMinutes(now, 31)
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
          gte: reminderStart,
          lte: reminderEnd,
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

    console.log({
      mensagem: "reminders query",
      agoraUTC: now.toISOString(),
      agoraSP: nowSaoPaulo,
      reminderStartUTC: reminderStart.toISOString(),
      reminderStartSP: formatInTimeZone(
        reminderStart,
        "America/Sao_Paulo",
        "yyyy-MM-dd HH:mm:ssXXX",
      ),
      reminderEndUTC: reminderEnd.toISOString(),
      reminderEndSP: formatInTimeZone(
        reminderEnd,
        "America/Sao_Paulo",
        "yyyy-MM-dd HH:mm:ssXXX",
      ),
      bookingsEncontrados: bookings.length,
    })

    const reminders = bookings.map((booking) => {
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

      return booking
    })

    return NextResponse.json(reminders, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao buscar lembretes",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    )
  }
}
