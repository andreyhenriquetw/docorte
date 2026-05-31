import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
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
      const diffMinutes = (booking.date.getTime() - Date.now()) / 1000 / 60

      console.log("CLIENTE:", booking.user.name, "FALTAM:", diffMinutes, "MIN")

      return diffMinutes >= 29 && diffMinutes <= 31
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
