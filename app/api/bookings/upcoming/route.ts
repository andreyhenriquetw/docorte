import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export async function GET() {
  try {
    const now = toZonedTime(new Date(), "America/Sao_Paulo")

    console.log("AGORA BR:", now.toISOString())

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

        barber: true,
      },
    })

    const debugData = bookings.map((booking) => {
      const bookingDate = toZonedTime(booking.date, "America/Sao_Paulo")

      const diff = bookingDate.getTime() - now.getTime()

      const minutes = diff / 1000 / 60

      console.log("===================================")
      console.log("AGORA:", now.toISOString())
      console.log("AGENDAMENTO:", bookingDate.toISOString())
      console.log("MINUTOS RESTANTES:", minutes)

      return {
        id: booking.id,
        now: now.toISOString(),
        bookingDate: bookingDate.toISOString(),
        minutes,
        client: booking.user.name,
      }
    })

    return NextResponse.json(debugData)
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
