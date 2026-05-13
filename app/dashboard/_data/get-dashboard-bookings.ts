"use server"

import { db } from "../../_lib/prisma"
import { toZonedTime } from "date-fns-tz"

export const getDashboardBookings = async () => {
  const now = toZonedTime(new Date(), "America/Sao_Paulo")

  return db.booking.findMany({
    where: {
      date: {
        gte: now,
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
