import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  const bookings = await db.booking.findMany({
    where: {
      reminderSent: false,
    },
  })

  return NextResponse.json(
    bookings.map((booking) => ({
      id: booking.id,
      bookingDate: booking.date,
      localHour: booking.date.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }),
    })),
  )
}
