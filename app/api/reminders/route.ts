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
      bookings.map((booking) => ({
        cliente: booking.user.name,

        utc: booking.date.toISOString(),

        saoPaulo: booking.date.toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),

        nowUTC: now.toISOString(),

        nowSaoPaulo: now.toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        }),
      })),
    )
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: "Erro ao buscar lembretes" },
      { status: 500 },
    )
  }
}
