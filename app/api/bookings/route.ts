import { NextResponse } from "next/server"

import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const bookings = await db.booking.findMany({
      where: {
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

      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json(bookings)
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
