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
import { useEffect, useMemo, useRef, useState } from "react"
import { isPast, set, format } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import { useRouter } from "next/navigation"
import { toZonedTime } from "date-fns-tz"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">

  barbers: {
    id: string
    name: string
    imageUrl: string
    specialty?: string | null
  }[]
}

const getOpeningHours = (date: Date) => {
  const day = date.getDay()

  if (day >= 1 && day <= 4) {
    return { open: 16, close: 21 }
  }

  if (day === 5) {
    return { open: 14, close: 21 }
  }

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

    const now = toZonedTime(new Date(), "America/Sao_Paulo")

    const timeSlot = set(selectedDay, {
      hours: hour,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })

    const isSameDay =
      format(now, "yyyy-MM-dd") === format(selectedDay, "yyyy-MM-dd")

    if (isSameDay && isPast(timeSlot)) return false

    const hasBookingOnCurrentTime = bookings.some((booking) => {
      const bookingTime = toZonedTime(booking.date, "America/Sao_Paulo")

      return (
        bookingTime.getHours() === hour && bookingTime.getMinutes() === minutes
      )
    })

    return !hasBookingOnCurrentTime
  })
}

const ServiceItem = ({ service, barbershop, barbers }: ServiceItemProps) => {
  const { data } = useSession()

  const router = useRouter()

  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)

  const [selectedDay, setSelectedDay] = useState<Date>()

  const [selectedBarber, setSelectedBarber] = useState<string>()

  const [selectedTime, setSelectedTime] = useState<string>()

  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  const barberSectionRef = useRef<HTMLDivElement | null>(null)
  const timeSectionRef = useRef<HTMLDivElement | null>(null)
  const confirmSectionRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (selectedDay && barberSectionRef.current) {
      setTimeout(() => {
        barberSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 250)
    }
  }, [selectedDay])

  useEffect(() => {
    if (selectedBarber && timeSectionRef.current) {
      setTimeout(() => {
        timeSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 250)
    }
  }, [selectedBarber])

  useEffect(() => {
    if (selectedTime && confirmSectionRef.current) {
      setTimeout(() => {
        confirmSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 250)
    }
  }, [selectedTime])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return

    return set(selectedDay, {
      hours: Number(selectedTime.split(":")[0]),
      minutes: Number(selectedTime.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }

    setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setSelectedBarber(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handCreateBooking = async () => {
    try {
      if (!selectedDate || !selectedBarber) return

      await createBooking({
        serviceId: service.id,
        barberId: selectedBarber,
        date: selectedDate,
      })

      const formattedDate = format(selectedDate, "dd/MM/yyyy", {
        locale: ptBR,
      })

      const formattedTime = format(selectedDate, "HH:mm")

      const selectedBarberName =
        barbers.find((b) => b.id === selectedBarber)?.name ?? "Barbeiro"

      const formattedPrice = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(service.price))

      const clientName = data?.user?.name ?? "Cliente"

      const message = `Olá, sou ${clientName} e gostaria de confirmar meu agendamento:

💈 Barbearia: ${barbershop.name}
✂️ Serviço: ${service.name}
💇‍♂️ Barbeiro: ${selectedBarberName}
📅 Data: ${formattedDate} às ${formattedTime}
💵 Preço: ${formattedPrice}`

      const phoneNumber = "353874772097"

      const encodedMessage = encodeURIComponent(message)

      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`

      handleBookingSheetOpenChange()

      toast.success("Reserva criada com sucesso!")

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
          <div className="relative h-[113px] w-[113px] shrink-0">
            <Image
              alt={service.name}
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold">{service.name}</h3>

              <p className="text-sm text-gray-400">{service.description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
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

                <SheetContent className="flex h-screen w-full flex-col overflow-hidden border-l border-zinc-800 bg-[#09090B] p-0 sm:max-w-md">
                  <SheetHeader className="border-b p-4">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto">
                    {/* calendário */}
                    <div className="border-b border-zinc-800 px-3">
                      <div className="mb-4">
                        <h2 className="text-lg font-bold text-white">
                          Escolha a data
                        </h2>

                        <p className="text-sm text-zinc-400">
                          Selecione o melhor dia para você
                        </p>
                      </div>

                      <Calendar
                        mode="single"
                        locale={ptBR}
                        selected={selectedDay}
                        onSelect={handleDateSelect}
                        fromDate={new Date()}
                        className="mx-auto"
                        classNames={{
                          months: "flex justify-center",
                          month: "space-y-4",
                          table: "w-full border-collapse",
                          head_row: "flex",
                          row: "mt-2 flex w-full justify-between",
                          cell: "relative flex h-10 w-12 items-center justify-center p-0 text-center",
                          day: "flex h-9 w-9 items-center justify-center rounded-xl p-0 font-normal",
                          day_selected:
                            "bg-green-500 text-white hover:bg-green-600 rounded-xl",
                          day_today:
                            "border border-green-500 text-green-400 rounded-xl",
                        }}
                      />
                    </div>

                    {/* barbeiros */}
                    {selectedDay && (
                      <div
                        ref={barberSectionRef}
                        className="border-b border-zinc-800 px-3 py-5"
                      >
                        <div className="mb-4">
                          <h2 className="text-lg font-bold text-white">
                            Escolha o barbeiro
                          </h2>

                          <p className="text-sm text-zinc-400">
                            Escolha quem irá realizar o atendimento
                          </p>
                        </div>

                        <div className="space-y-3">
                          {barbers?.map((barber) => (
                            <button
                              key={barber.id}
                              type="button"
                              onClick={() => setSelectedBarber(barber.id)}
                              className={`w-full rounded-3xl border transition-all duration-200 ${
                                selectedBarber === barber.id
                                  ? "border-green-500 bg-green-500/10"
                                  : "border-zinc-800 bg-zinc-900"
                              }`}
                            >
                              <div className="flex items-center gap-4 p-3">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
                                  <Image
                                    src={barber.imageUrl}
                                    alt={barber.name}
                                    fill
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="flex flex-1 flex-col text-left">
                                  <span className="text-sm font-semibold text-white">
                                    {barber.name}
                                  </span>

                                  <span className="mt-1 text-xs text-zinc-400">
                                    {barber.specialty ||
                                      "Barbeiro profissional"}
                                  </span>
                                </div>

                                {selectedBarber === barber.id && (
                                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-black">
                                    ✓
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* horários */}
                    {selectedDay && selectedBarber && (
                      <div
                        ref={timeSectionRef}
                        className="border-b border-zinc-800 px-3 py-5"
                      >
                        <div className="mb-4">
                          <h2 className="text-lg font-bold text-white">
                            Horários disponíveis
                          </h2>

                          <p className="text-sm text-zinc-400">
                            Escolha o horário desejado
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {timeList.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "default" : "outline"
                              }
                              onClick={() => handleTimeSelect(time)}
                              className={`h-11 rounded-2xl text-sm font-semibold transition-all ${
                                selectedTime === time
                                  ? "bg-green-500 text-black hover:bg-green-400"
                                  : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                              }`}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* resumo */}
                    {selectedDate && (
                      <div ref={confirmSectionRef} className="px-3 py-5">
                        <div className="mb-4">
                          <h2 className="text-lg font-bold text-white">
                            Resumo da reserva
                          </h2>

                          <p className="text-sm text-zinc-400">
                            Confira os detalhes do agendamento
                          </p>
                        </div>

                        <div>
                          <div className="p-1">
                            <BookingSummary
                              barbershop={barbershop}
                              service={service}
                              selectedDate={selectedDate}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <SheetFooter className="sticky bottom-3 border-t border-zinc-800 bg-[#09090B]/95 px-4 pb-4 pt-3 backdrop-blur-md">
                    <Button
                      onClick={handCreateBooking}
                      disabled={
                        !selectedDay || !selectedTime || !selectedBarber
                      }
                      className="h-14 w-full rounded-2xl bg-green-500 text-base font-bold text-black hover:bg-green-400"
                    >
                      CONFIRMAR NO WHATSAPP
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
