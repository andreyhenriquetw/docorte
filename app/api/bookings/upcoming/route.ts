import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export async function GET() {
  try {
    const now = toZonedTime(new Date(), "America/Sao_Paulo")

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

    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = toZonedTime(booking.date, "America/Sao_Paulo")

      const diff = bookingDate.getTime() - now.getTime()
      const minutes = diff / 1000 / 60

      console.log(booking.user.name, "faltam", minutes, "minutos")

      // dispara quando faltar entre 28 e 31 minutos
      return minutes >= 28 && minutes <= 31
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
