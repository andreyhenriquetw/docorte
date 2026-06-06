"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "../_lib/auth"

import { db } from "../_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export const getConfirmedBookings = async () => {
  const session = await getServerSession(authOptions)

  // usuário não logado
  if (!session?.user?.email) {
    return []
  }

  const now = toZonedTime(new Date(), "America/Sao_Paulo")

  const bookings = await db.booking.findMany({
    where: {
      user: {
        email: session.user.email,
      },

      status: "CONFIRMED",

      date: {
        gte: now,
      },
    },

    include: {
      service: {
        include: {
          barbershop: true,
        },
      },

      barber: true,

      user: true,
    },

    orderBy: {
      date: "asc",
    },
  })

  return bookings.map((booking) => ({
    ...booking,

    service: {
      ...booking.service,

      price: Number(booking.service.price),
    },
  }))
}
