"use server"

import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"
import { pusherServer } from "../_lib/pusher"

export const deleteBooking = async (bookingId: string) => {
  try {
    const booking = await db.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        service: true,
        user: true,
      },
    })

    await db.booking.delete({
      where: {
        id: bookingId,
      },
    })

    // avisa em tempo real
    await pusherServer.trigger("dashboard", "booking-cancelled", {
      bookingId,
      clientName: booking?.user?.name,
      service: booking?.service?.name,
    })

    revalidatePath("/dashboard")
    revalidatePath("/bookings")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Erro ao cancelar reserva:", error)

    return {
      success: false,
    }
  }
}
