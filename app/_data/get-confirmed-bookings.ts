"use server"

import { getServerSession } from "next-auth"

import { authOptions } from "../_lib/auth"

import { db } from "../_lib/prisma"

export const getConfirmedBookings = async () => {
  const session = await getServerSession(authOptions)

  // usuário não logado
  if (!session?.user?.email) {
    return []
  }

  const bookings = await db.booking.findMany({
    where: {
      user: {
        email: session.user.email,
      },

      status: "CONFIRMED",

      date: {
        gte: new Date(),
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
