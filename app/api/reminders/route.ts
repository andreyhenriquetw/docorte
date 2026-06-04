import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  try {
    const now = new Date()

    const reminders = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,

        reminderDate: {
          lte: now,
        },

        date: {
          gt: now,
        },
      },

      include: {
        user: true,
        service: true,
        barber: true,
      },

      orderBy: {
        reminderDate: "asc",
      },
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
