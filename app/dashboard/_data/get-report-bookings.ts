"use server"

import { db } from "../../_lib/prisma"

export const getReportBookings = async () => {
  const bookings = await db.booking.findMany({
    where: {
      status: {
        not: "CANCELED",
      },
    },

    include: {
      user: true,

      service: {
        include: {
          barbershop: true,
        },
      },

      barber: true,
    },

    orderBy: {
      date: "desc",
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
