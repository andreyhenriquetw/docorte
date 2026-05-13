"use client"

import { Bell, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useNotifications } from "../_contexts/notification-context"

export default function NotificationBell() {
  const [open, setOpen] = useState(false)

  const boxRef = useRef<HTMLDivElement>(null)

  const { notifications, markAllAsRead, removeNotification } =
    useNotifications()

  const unreadCount = notifications.filter((n) => !n.read).length

  // fecha clicando fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={boxRef} className="relative">
      <button
        onClick={() => {
          const nextOpen = !open

          setOpen(nextOpen)

          // só remove alerta ao abrir
          if (nextOpen) {
            markAllAsRead()
          }
        }}
        className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:bg-zinc-800"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <>
            <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>

            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
              {unreadCount}
            </span>
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-16 z-50 w-[370px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="border-b border-zinc-800 p-4">
            <h3 className="font-semibold text-white">Notificações</h3>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-zinc-500">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-zinc-800 p-4 transition hover:bg-zinc-900"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-white">
                        {notification.title}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        {notification.description}
                      </p>

                      <span className="mt-2 block text-xs text-zinc-500">
                        {notification.createdAt}
                      </span>
                    </div>

                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-zinc-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
