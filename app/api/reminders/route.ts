import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export async function GET() {
  try {
    const now = toZonedTime(new Date(), "America/Sao_Paulo")

    const bookings = await db.booking.findMany({
      where: {
        status: "CONFIRMED",
        reminderSent: false,
      },
    })

    const reminders = bookings.filter((booking) => {
      const bookingDate = toZonedTime(booking.date, "America/Sao_Paulo")

      const minutes = (bookingDate.getTime() - now.getTime()) / 1000 / 60

      console.log({
        now: now.toString(),
        booking: bookingDate.toString(),
        minutes,
      })

      return NextResponse.json({
        serverNowUTC: new Date().toISOString(),

        serverNowBrazil: toZonedTime(
          new Date(),
          "America/Sao_Paulo",
        ).toString(),

        bookingDate: bookings[0]?.date,
      })
    })

    return NextResponse.json(reminders)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro",
      },
      {
        status: 500,
      },
    )
  }
}
