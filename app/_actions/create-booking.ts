"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { pusherServer } from "../_lib/pusher"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    throw new Error("Usuário não autenticado")
  }

  const booking = await db.booking.create({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: {
      ...params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userId: (session.user as any).id,
    },

    include: {
      user: true,
      service: true,
    },
  })

  // tempo real
  await pusherServer.trigger("dashboard", "new-booking", {
    id: booking.id,
    clientName: booking.user.name,
    service: booking.service.name,
  })

  revalidatePath("/barbershops/[id]")
  revalidatePath("/bookings")
  revalidatePath("/dashboard")
}
