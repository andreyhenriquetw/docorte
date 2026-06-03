import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  const now = new Date()

  const bookings = await db.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSent: false,
    },
  })

  return NextResponse.json({
    serverTimeUTC: now.toISOString(),

    bookings: bookings.map((booking) => ({
      id: booking.id,
      bookingDateUTC: booking.date.toISOString(),

      diffMinutes: (booking.date.getTime() - now.getTime()) / 1000 / 60,
    })),
  })
}
