"use server"

import { db } from "../_lib/prisma"

export const getConcludedBookings = async () => {
  return db.booking.findMany({
    where: {
      status: "COMPLETED",
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
