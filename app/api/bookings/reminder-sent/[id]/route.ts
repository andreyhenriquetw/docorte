import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await db.booking.update({
      where: {
        id: params.id,
      },

      data: {
        reminderSent: true,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch {
    return NextResponse.json(
      {
        error: "Erro ao atualizar reminder",
      },
      {
        status: 500,
      },
    )
  }
}
