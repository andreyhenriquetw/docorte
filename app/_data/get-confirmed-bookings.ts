"use server"

import { db } from "../_lib/prisma"

export const getConfirmedBookings = async () => {
  return db.booking.findMany({
    where: {
      status: "CONFIRMED",
    },

    include: {
      service: {
        include: {
          barbershop: true,
        },
      },

      user: true,
    },

    orderBy: {
      date: "asc",
    },
  })
}
