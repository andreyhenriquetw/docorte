import { NextRequest, NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    await db.booking.update({
      where: {
        id: body.bookingId,
      },

      data: {
        reminderSent: true,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao atualizar booking",
      },
      {
        status: 500,
      },
    )
  }
}
