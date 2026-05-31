import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function POST(
  req: Request,
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
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: "Erro ao atualizar lembrete",
      },
      {
        status: 500,
      },
    )
  }
}
