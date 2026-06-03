import { NextRequest, NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    console.log("ID RECEBIDO:", params.id)

    const booking = await db.booking.update({
      where: {
        id: params.id,
      },
      data: {
        reminderSent: true,
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("ERRO PATCH:")
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao atualizar lembrete",
        details: String(error),
      },
      {
        status: 500,
      },
    )
  }
}
