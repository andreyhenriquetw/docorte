"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getPusherClient } from "@/app/_lib/pusher-client"
import { useNotifications } from "../_contexts/notification-context"

export default function BookingNotification() {
  const router = useRouter()

  const { addNotification } = useNotifications()

  useEffect(() => {
    const pusher = getPusherClient()

    const channel = pusher.subscribe("dashboard")

    // NOVO AGENDAMENTO
    channel.bind(
      "new-booking",
      (data: { clientName?: string; service?: string }) => {
        try {
          const audio = new Audio("/notification.mp3")

          audio.volume = 0.55

          audio.play().catch(() => {})
        } catch {}

        // sino
        addNotification({
          id: Date.now(),
          title: "Novo agendamento 🔥",
          description: `${data.clientName || "Cliente"} agendou ${data.service || "um serviço"}`,
          createdAt: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })

        // toast
        toast.success("Novo agendamento 🔥", {
          description: `${data.clientName || "Cliente"} agendou ${data.service || "um serviço"}`,
          duration: 5000,
        })

        router.refresh()
      },
    )

    // CANCELAMENTO
    channel.bind(
      "booking-cancelled",
      (data: { clientName?: string; service?: string }) => {
        try {
          const audio = new Audio("/notification.mp3")

          audio.volume = 0.45

          audio.play().catch(() => {})
        } catch {}

        // sino
        addNotification({
          id: Date.now(),
          title: "Agendamento cancelado ❌",
          description: `${data.clientName || "Cliente"} cancelou ${data.service || "um serviço"}`,
          createdAt: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        })

        // toast
        toast.error("Agendamento cancelado", {
          description: `${data.clientName || "Cliente"} cancelou ${data.service || "um serviço"}`,
          duration: 5000,
        })

        // atualiza sozinho
        router.refresh()
      },
    )

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("dashboard")
    }
  }, [router, addNotification])

  return null
}
