import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export async function GET() {
  try {
    const now = toZonedTime(new Date(), "America/Sao_Paulo")

    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    console.log("HORA BR:", currentHour + ":" + currentMinute)

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

      const bookingHour = bookingDate.getHours()

      const bookingMinute = bookingDate.getMinutes()

      console.log("BOOKING:", booking.id, bookingHour + ":" + bookingMinute)

      // exemplo:
      // agora 13:30 → pega 14:00
      return (
        bookingHour === currentHour + 1 &&
        currentMinute >= 29 &&
        currentMinute <= 31 &&
        bookingMinute === 0
      )
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
