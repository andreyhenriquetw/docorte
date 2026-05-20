"use server"

import { startOfMonth, endOfMonth } from "date-fns"

import { db } from "../../_lib/prisma"

import { toZonedTime } from "date-fns-tz"

export const getDashboardBookings = async () => {
  const now = toZonedTime(new Date(), "America/Sao_Paulo")

  // FINALIZA AUTOMATICAMENTE AGENDAMENTOS VENCIDOS
  await db.booking.updateMany({
    where: {
      status: "CONFIRMED",

      date: {
        lt: now,
      },
    },

    data: {
      status: "COMPLETED",
    },
  })

  // PEGA TODOS OS AGENDAMENTOS DO MÊS
  const bookings = await db.booking.findMany({
    where: {
      status: {
        not: "CANCELED",
      },

      date: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
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
      date: "asc",
    },
  })

  return bookings.map((booking) => ({
    ...booking,

    service: {
      ...booking.service,

      // CONVERTE DECIMAL PARA NUMBER
      price: Number(booking.service.price),
    },
  }))
}
