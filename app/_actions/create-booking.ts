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

  // ENVIA DADOS PARA O N8N
  try {
    await fetch("http://localhost:5678/webhook-test/novo-agendamento", {
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

        date: booking.date,
      }),
    })
  } catch (error) {
    console.error("Erro ao enviar para o n8n:", error)
  }

  // ENVIO WHATSAPP
  try {
    const phone = booking.user.phone?.replace(/\D/g, "")

    if (phone) {
      const formattedDate = new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "America/Sao_Paulo",
      }).format(new Date(booking.date))

      await fetch("http://localhost:8080/message/sendText/barber", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          apikey: "123456",
        },

        body: JSON.stringify({
          number: `55${phone}`,

          textMessage: {
            text: `Olá ${booking.user.name}, seu agendamento foi confirmado ✅

💈 Barbearia: ${booking.service.barbershop.name}
✂️ Serviço: ${booking.service.name}
💇‍♂️ Barbeiro: ${booking.barber?.name}
📅 Data: ${formattedDate}

Obrigado pela preferência.`,
          },
        }),
      })
    }
  } catch (error) {
    console.error("Erro ao enviar WhatsApp:", error)
  }

  // TEMPO REAL DASHBOARD
  await pusherServer.trigger("dashboard", "new-booking", {
    id: booking.id,
    clientName: booking.user.name,
    service: booking.service.name,
    barber: booking.barber?.name,
  })

  revalidatePath("/barbershops/[id]", "page")
  revalidatePath("/bookings")
  revalidatePath("/dashboard")

  return {
    ...booking,

    service: {
      ...booking.service,

      price: Number(booking.service.price),

      barbershop: {
        ...booking.service.barbershop,
      },
    },
  }
}
