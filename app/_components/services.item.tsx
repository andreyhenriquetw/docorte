"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { isPast, set, format } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"

import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import { useRouter } from "next/navigation"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

// Função de configuração de horários por dia da semana
const getOpeningHours = (date: Date) => {
  const day = date.getDay() // 0 = Domingo, 1 = Segunda ...

  // Segunda a Quinta → 16h às 21h
  if (day >= 1 && day <= 4) {
    return { open: 16, close: 21 }
  }

  // Sexta-feira → 14h às 21h
  if (day === 5) {
    return { open: 14, close: 21 }
  }

  // Sábado e Domingo → 08h às 22h
  if (day === 6 || day === 0) {
    return { open: 8, close: 22 }
  }

  return null
}

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  const config = getOpeningHours(selectedDay)
  if (!config) return []

  const times: string[] = []

  for (let hour = config.open; hour < config.close; hour++) {
    times.push(`${String(hour).padStart(2, "0")}:00`)
  }

  return times.filter((time) => {
    const [hourStr, minStr] = time.split(":")
    const hour = Number(hourStr)
    const minutes = Number(minStr)

    const now = new Date()

    const timeSlot = set(selectedDay, {
      hours: hour,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })

    const isSameDay =
      format(now, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")

    if (isSameDay && isPast(timeSlot)) return false

    // ❌ não mostrar horários já reservados
    const hasBookingOnCurrentTime = bookings.some((booking) => {
      return (
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minutes
      )
    })

    return !hasBookingOnCurrentTime
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }

    fetch()
  }, [selectedDay, service.id])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handCreateBooking = async () => {
    try {
      if (!selectedDate) return

      await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })

      const formattedDate = format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
      const formattedTime = format(selectedDate, "HH:mm")
      const formattedPrice =
        "€ " +
        Intl.NumberFormat("en-IE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(service.price))

      const clientName = data?.user?.name ?? "Cliente"

      const message = `Olá, sou ${clientName} e gostaria de confirmar meu agendamento:

💈- Barbearia: ${barbershop.name}
✂️ - Serviço: ${service.name}
📅 - Data: ${formattedDate} às ${formattedTime}
💵 - Preço: ${formattedPrice}`

      const phoneNumber = "353874772097"
      const encodedMessage = encodeURIComponent(message)
      const link = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

      // abre o WhatsApp direto
      window.open(link, "_blank")

      handleBookingSheetOpenChange()

      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })

      // volta para a página inicial
      router.push("/")
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDay,
    })
  }, [dayBookings, selectedDay])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative max-h-[113px] min-h-[113px] min-w-[113px] max-w-[113px]">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            <div className="mt-auto flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {"€ " +
                  Intl.NumberFormat("en-IE", {
                    minimumFractionDigits: 2,
                  }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>
                <SheetContent className="flex max-h-dvh w-[84%] flex-col p-0">
                  <SheetHeader className="p-2">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="-mt-3 border-b border-solid">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      disabled={(date) => {
                        const config = getOpeningHours(date)
                        return config === null
                      }}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: { width: "100%" },
                        button: { width: "100%" },
                        nav_button_previous: { width: "32px", height: "32px" },
                        nav_button_next: { width: "32px", height: "32px" },
                        caption: { textTransform: "capitalize" },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-2 overflow-x-auto border-b pb-3 pl-5">
                      {(() => {
                        const config = getOpeningHours(selectedDay)
                        if (!config)
                          return (
                            <p className="text-xs">
                              Estamos fechados neste dia.
                            </p>
                          )

                        if (timeList.length > 0) {
                          return timeList.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              className="rounded-full"
                              onClick={() => handleTimeSelect(time)}
                            >
                              {time}
                            </Button>
                          ))
                        }

                        return (
                          <p className="text-xs">
                            Não há horários disponíveis.
                          </p>
                        )
                      })()}
                    </div>
                  )}

                  {selectedDate && (
                    <div className="-mt-2 p-3">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                      />
                    </div>
                  )}
                  <SheetFooter className="-mt-2 px-4">
                    <Button
                      onClick={handCreateBooking}
                      disabled={!selectedDay || !selectedTime}
                      className="bg-green-500 text-white hover:bg-green-600"
                    >
                      Confirmar no WhatsApp
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
