"use server"

import { db } from "../_lib/prisma"

export const getAllBookings = async () => {
  return db.booking.findMany({
    include: {
      user: true,
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  })
}
