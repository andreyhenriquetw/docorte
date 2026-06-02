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

  console.log("DATA RECEBIDA:", params.date)

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

      barber: true,
    },
  })

  // N8N ENVIAR DADOS

  try {
    await fetch(
      "https://thereafter-planets-javascript-solaris.trycloudflare.com/webhook/novo-agendamento",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          bookingId: booking.id,

          client: {
            id: booking.user.id,
            name: booking.user.name,
            email: booking.user.email,
            phone: booking.user.phone,
          },

          service: {
            id: booking.service.id,
            name: booking.service.name,
            price: Number(booking.service.price),
          },

          barber: {
            id: booking.barber?.id,
            name: booking.barber?.name,
          },

          barbershop: {
            id: booking.service.barbershop.id,
            name: booking.service.barbershop.name,
          },

          payment: {
            method: params.paymentMethod,

            servicePrice: Number(booking.service.price),

            cashAmount: params.cashAmount || null,

            change:
              params.paymentMethod === "money" && params.cashAmount
                ? Number(params.cashAmount) - Number(booking.service.price)
                : null,
          },

          date: booking.date,
        }),
      },
    )
  } catch (error) {
    console.error("Erro ao enviar para o n8n:", error)
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
