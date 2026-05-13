"use client"

import { createContext, useContext, useState } from "react"

interface Notification {
  id: number
  title: string
  description: string
  createdAt: string
  read?: boolean
}

interface NotificationContextProps {
  notifications: Notification[]

  addNotification: (
    // eslint-disable-next-line no-unused-vars
    notification: Notification,
  ) => void

  markAllAsRead: () => void

  removeNotification: (
    // eslint-disable-next-line no-unused-vars
    id: number,
  ) => void
}

const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps,
)

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [
      {
        ...notification,
        read: false,
      },
      ...prev,
    ])

    // remove após 5 minutos
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    }, 300000)
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      })),
    )
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
