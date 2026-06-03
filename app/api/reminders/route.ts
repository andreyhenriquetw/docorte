import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET() {
  const bookings = await db.booking.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  })

  return NextResponse.json(bookings)
}
