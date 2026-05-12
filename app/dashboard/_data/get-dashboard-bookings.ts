"use server"

import { db } from "../../_lib/prisma"

export const getDashboardBookings = async () => {
  return db.booking.findMany({
    where: {
      date: {
        gte: new Date(),
      },
    },
    include: {
      user: true,
      service: {
        include: {
          barbershop: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })
}
