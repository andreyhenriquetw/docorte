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
import { updateUserProfile } from "../_actions/update-user-profile"
import { Loader2 } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { useCallback } from "react"
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

const getOpeningHours = () => {
  return {
    open: 9,
    close: 23,
  }
}

interface GetTimeListProps {
  bookings: Booking[]
  selectedDay: Date
}

const getTimeList = ({ bookings, selectedDay }: GetTimeListProps) => {
  const config = getOpeningHours()

  if (!config) return []

  const times: string[] = []

  for (let hour = config.open; hour <= config.close; hour++) {
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

  const [profileDialogOpen, setProfileDialogOpen] = useState(false)

  const [name, setName] = useState(data?.user?.name || "")

  const [phone, setPhone] = useState("")

  const [selectedDay, setSelectedDay] = useState<Date>()

  const [selectedBarber, setSelectedBarber] = useState<string>(barbers[0]!.id)

  const [selectedTime, setSelectedTime] = useState<string>()

  const [paymentMethod, setPaymentMethod] = useState<"pix" | "money" | null>(
    null,
  )

  const [cashAmount, setCashAmount] = useState("")

  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const barberSectionRef = useRef<HTMLDivElement | null>(null)
  const timeSectionRef = useRef<HTMLDivElement | null>(null)
  const confirmSectionRef = useRef<HTMLDivElement | null>(null)
  const paymentSectionRef = useRef<HTMLDivElement | null>(null)

  const resetBookingForm = useCallback(() => {
    setSelectedDay(undefined)

    setSelectedBarber(barbers[0]!.id)

    setSelectedTime(undefined)

    setPaymentMethod(null)

    setCashAmount("")

    setDayBookings([])
  }, [barbers])

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
    if (selectedTime && paymentSectionRef.current) {
      setTimeout(() => {
        paymentSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 250)
    }
  }, [selectedTime])

  useEffect(() => {
    if (paymentMethod && confirmSectionRef.current) {
      setTimeout(() => {
        confirmSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 250)
    }
  }, [paymentMethod])

  useEffect(() => {
    if (data?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasPhone = (data.user as any)?.phone

      if (!hasPhone) {
        setName(data.user.name ?? "")
        setProfileDialogOpen(true)
      }
    }
  }, [data])

  useEffect(() => {
    const handlePopState = () => {
      setBookingSheetIsOpen(false)

      resetBookingForm()
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [resetBookingForm])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return

    return set(selectedDay, {
      hours: Number(selectedTime.split(":")[0]),
      minutes: Number(selectedTime.split(":")[1]),
      seconds: 0,
      milliseconds: 0,
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hasPhone = (data.user as any)?.phone

      if (!hasPhone) {
        setProfileDialogOpen(true)
        return
      }

      window.history.pushState({ bookingSheet: true }, "")

      setBookingSheetIsOpen(true)

      return
    }

    setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setSelectedBarber(barbers[0]!.id)
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

      setLoading(true)

      await createBooking({
        serviceId: service.id,
        barberId: selectedBarber,
        date: selectedDate,

        paymentMethod: paymentMethod as "pix" | "money",

        cashAmount: paymentMethod === "money" ? cashAmount : undefined,
      })

      handleBookingSheetOpenChange()

      toast.success("Reserva criada com sucesso!")

      router.push("/")
    } catch (error) {
      console.error(error)

      toast.error("Erro ao criar reserva!")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      if (!name || !phone) {
        toast.error("Preencha nome e WhatsApp")
        return
      }

      await updateUserProfile({
        name,
        phone,
      })

      toast.success("Perfil atualizado!")

      setProfileDialogOpen(false)

      // abre o agendamento depois de salvar
      setBookingSheetIsOpen(true)
    } catch (error) {
      console.error(error)

      toast.error("Erro ao salvar perfil")
    }
  }

  const servicePrice = Number(service.price)

  const change =
    paymentMethod === "money" && cashAmount
      ? Number(cashAmount) - servicePrice
      : 0

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
                onOpenChange={(open) => {
                  setBookingSheetIsOpen(open)

                  if (!open) {
                    resetBookingForm()
                  }
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="min-w-[90px]"
                  disabled={loading}
                  onClick={() => {
                    setLoading(true)

                    setTimeout(() => {
                      handleBookingClick()
                      setLoading(false)
                    }, 400)
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-[#3072ee]" />
                    </div>
                  ) : (
                    "Reservar"
                  )}
                </Button>

                <SheetContent className="flex h-[100dvh] w-full flex-col border-l border-zinc-800 bg-[#09090B] p-0 sm:max-w-md [&>button:hover]:scale-105 [&>button:hover]:border-red-500/40 [&>button:hover]:bg-red-500/10 [&>button:hover]:text-red-400 [&>button]:right-4 [&>button]:top-4 [&>button]:rounded-full [&>button]:border [&>button]:border-zinc-700 [&>button]:bg-zinc-900 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100 [&>button]:shadow-lg [&>button]:transition-all">
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

                      <div className="overflow-x-auto pb-2">
                        <div className="flex min-w-max gap-3 px-1">
                          {Array.from({ length: 6 }).map((_, index) => {
                            const date = new Date()

                            date.setDate(date.getDate() + index)

                            const isSelected =
                              selectedDay &&
                              format(selectedDay, "yyyy-MM-dd") ===
                                format(date, "yyyy-MM-dd")

                            return (
                              <button
                                key={index}
                                onClick={() => handleDateSelect(date)}
                                className={`group flex h-[88px] w-[72px] shrink-0 flex-col items-center justify-center rounded-3xl border transition-all duration-200 ${
                                  isSelected
                                    ? "border-blue-500 bg-blue-500 text-black shadow-lg shadow-blue-500/20"
                                    : "border-zinc-800 bg-zinc-900 text-white hover:border-zinc-600 hover:bg-zinc-800"
                                }`}
                              >
                                <span
                                  className={`text-[12px] uppercase tracking-wide ${
                                    isSelected
                                      ? "text-black/100"
                                      : "text-blue-600"
                                  }`}
                                >
                                  {format(date, "EEE", {
                                    locale: ptBR,
                                  })}
                                </span>

                                <span className="mt-2 text-2xl font-bold">
                                  {format(date, "d")}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    {/* barbeiros */}
                    {false && selectedDay && (
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
                                  ? "border-blue-500 bg-yellow-500/10"
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
                                      "Disponível para todos os serviços"}
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
                                  ? "bg-blue-500 text-black hover:bg-blue-500"
                                  : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                              }`}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PAGAMENTO */}

                    {selectedDate && (
                      <div
                        ref={paymentSectionRef}
                        className="border-b border-zinc-800 px-3 py-5"
                      >
                        <div className="mb-4">
                          <h2 className="text-lg font-bold text-white">
                            Forma de pagamento
                          </h2>

                          <p className="text-sm text-zinc-400">
                            Escolha como deseja pagar
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("pix")}
                            className={`rounded-3xl border p-4 transition-all ${
                              paymentMethod === "pix"
                                ? "border-green-500 bg-green-500/10"
                                : "border-zinc-800 bg-zinc-900"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <span className="text-3xl">💳</span>

                              <span className="font-semibold text-white">
                                PIX
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("money")}
                            className={`rounded-3xl border p-4 transition-all ${
                              paymentMethod === "money"
                                ? "border-yellow-500 bg-yellow-500/10"
                                : "border-zinc-800 bg-zinc-900"
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center gap-2">
                              <span className="text-3xl">💵</span>

                              <span className="font-semibold text-white">
                                Dinheiro
                              </span>
                            </div>
                          </button>
                        </div>

                        {paymentMethod === "money" && (
                          <div className="mt-4">
                            <label className="mb-2 block text-sm text-zinc-300">
                              Valor que o cliente vai pagar
                            </label>

                            <input
                              type="number"
                              placeholder="Ex: 50"
                              value={cashAmount}
                              onChange={(e) => setCashAmount(e.target.value)}
                              className="h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 text-white outline-none focus:border-yellow-500"
                            />

                            {Number(cashAmount) > servicePrice && (
                              <p className="mt-2 text-sm text-green-400">
                                Troco:{" "}
                                {Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(change)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* resumo */}
                    {selectedDate && paymentMethod && (
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
                              paymentMethod={paymentMethod}
                              cashAmount={cashAmount}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <SheetFooter className="sticky bottom-3 border-t border-zinc-800 bg-[#09090B]/95 px-4 pt-3 backdrop-blur-md">
                    <Button
                      onClick={handCreateBooking}
                      disabled={
                        !selectedDay ||
                        !selectedTime ||
                        !selectedBarber ||
                        !paymentMethod ||
                        loading
                      }
                      className="h-14 w-full rounded-2xl bg-blue-500 text-base font-bold text-black hover:bg-blue-400"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />

                          <span>Confirmando...</span>
                        </div>
                      ) : (
                        "CONFIRMAR AGENDAMENTO"
                      )}
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
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="top-[32%] translate-y-[-42%] overflow-hidden rounded-[32px] border border-zinc-800 bg-[#09090B] p-0 text-white sm:top-[50%] sm:max-w-[420px] sm:translate-y-[-50%]">
          {/* topo premium */}
          <div className="relative overflow-hidden border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-[#09090B] px-5 pb-5 pt-7">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green-500/10 blur-3xl" />

            <div className="relative z-10">
              <h2 className="flex items-center gap-2 text-[22px] font-bold leading-tight tracking-tight">
                <span>Complete seu cadastro</span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                  <FaWhatsapp
                    className="text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    size={20}
                  />
                </div>
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Precisamos de algumas informações para confirmar seus
                agendamentos no WhatsApp.
              </p>
            </div>
          </div>

          {/* formulário */}
          <div className="space-y-3 px-5 py-5">
            <div className="-mt-5 space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                WhatsApp
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500">
                  +55
                </span>

                <input
                  type="tel"
                  placeholder="93 99199-9999"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))
                  }
                  className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 pl-14 pr-4 text-[15px] text-white outline-none transition-all placeholder:text-zinc-500 focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />
              </div>

              <p className="text-xs text-zinc-500">
                Digite apenas DDD + número
              </p>
            </div>

            <Button
              className="mt-2 h-14 w-full rounded-2xl bg-green-500 text-[15px] font-semibold text-black transition-all hover:scale-[1.01] hover:bg-green-400 active:scale-[0.99]"
              onClick={handleUpdateProfile}
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
