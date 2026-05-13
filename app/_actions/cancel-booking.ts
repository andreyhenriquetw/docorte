"use server"

import { db } from "../_lib/prisma"

import { revalidatePath } from "next/cache"

export const cancelBooking = async (bookingId: string) => {
  try {
    await db.booking.delete({
      where: {
        id: bookingId,
      },
    })

    revalidatePath("/dashboard")

    revalidatePath("/dashboard/appointments")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Erro ao cancelar agendamento:", error)

    return {
      success: false,
    }
  }
}
