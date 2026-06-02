import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const bookings = await db.booking.findMany({
      include: {
        user: true,
        service: true,
        barber: true,
      },
    })

    return NextResponse.json({
      now,
      total: bookings.length,
      bookings,
    })
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
