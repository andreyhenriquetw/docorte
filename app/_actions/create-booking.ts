"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { pusherServer } from "../_lib/pusher"

interface CreateBookingParams {
  serviceId: string
  barberId: string
  date: Date
  paymentMethod: "pix" | "money"
  cashAmount?: string
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  const booking = await db.booking.create({
    data: {
      serviceId: params.serviceId,
      barberId: params.barberId,
      date: params.date,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (session.user as any).id,

      reminderSent: false,
    },

    include: {
      user: true,

      service: {
        include: {
          barbershop: true,
        },
      },
    },
  })

  // WEBHOOK CONFIRMAÇÃO
  try {
    console.log("ENVIANDO PARA N8N")

    const response = await fetch(
      "https://performance-compliant-wto-deck.trycloudflare.com/webhook/novo-agendamento",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          test: true,
          bookingId: booking.id,
          clientName: booking.user.name,
          phone: booking.user.phone,
        }),
      },
    )

    console.log("STATUS N8N:", response.status)

    const result = await response.text()

    console.log("RESPOSTA N8N:", result)
  } catch (error) {
    console.error("ERRO AO ENVIAR N8N:", error)
  }

  // DASHBOARD TEMPO REAL
  await pusherServer.trigger("dashboard", "new-booking", {
    id: booking.id,
    clientName: booking.user.name,
    service: booking.service.name,
  })

  revalidatePath("/barbershops/[id]", "page")

  revalidatePath("/bookings")
  revalidatePath("/dashboard")

  return JSON.parse(JSON.stringify(booking))
}
