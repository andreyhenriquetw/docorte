import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  const bookings = await db.booking.findMany({
    where: {
      reminderSent: false,
    },
  })

  return NextResponse.json(
    bookings.map((booking) => {
      const appointmentDate = new Date(booking.date)
      const now = new Date()

      const minutes = (appointmentDate.getTime() - now.getTime()) / (1000 * 60)

      return {
        id: booking.id,
        bookingDate: booking.date,
        now,
        minutes,
      }
    }),
  )
}
