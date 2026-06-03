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
    serverNow: now.toISOString(),
    serverNowLocal: now.toString(),
    bookings: bookings.map((booking) => ({
      id: booking.id,
      bookingDate: booking.date.toISOString(),
      diffMinutes: (booking.date.getTime() - now.getTime()) / 1000 / 60,
    })),
  })
}
