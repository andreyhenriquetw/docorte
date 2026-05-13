"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getPusherClient } from "@/app/_lib/pusher-client"

export default function BookingNotification() {
  const router = useRouter()

  useEffect(() => {
    const pusher = getPusherClient()

    const channel = pusher.subscribe("dashboard")

    channel.bind(
      "new-booking",
      (data: { clientName?: string; service?: string }) => {
        // som
        try {
          const audio = new Audio("/notification.mp3")

          audio.volume = 0.55

          audio.play().catch(() => {})
        } catch {}

        // toast
        toast.success("Novo agendamento 🔥", {
          description: `${data.clientName || "Cliente"} agendou ${data.service || "um serviço"}`,
          duration: 5000,
        })

        // atualiza dashboard
        router.refresh()
      },
    )

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("dashboard")
    }
  }, [router])

  return null
}
