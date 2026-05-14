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
      service: true,
      barber: true,
    },
  })

  // tempo real dashboard
  await pusherServer.trigger("dashboard", "new-booking", {
    id: booking.id,
    clientName: booking.user.name,
    service: booking.service.name,
    barber: booking.barber?.name,
  })

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
  revalidatePath("/dashboard")
}
