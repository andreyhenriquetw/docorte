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

    const reminders = bookings.filter((booking) => {
      const reminderTime = new Date(booking.date)

      // 30 minutos antes do horário agendado
      reminderTime.setMinutes(reminderTime.getMinutes() - 30)

      return (
        reminderTime.getFullYear() === now.getFullYear() &&
        reminderTime.getMonth() === now.getMonth() &&
        reminderTime.getDate() === now.getDate() &&
        reminderTime.getHours() === now.getHours() &&
        reminderTime.getMinutes() === now.getMinutes()
      )
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
