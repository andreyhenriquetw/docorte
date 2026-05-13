import React from "react"
import DashboardSidebar from "./_components/dashboard-sidebar"
import DashboardHeader from "./_components/dashboard-header"
import BookingNotification from "./_components/booking-notification"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1">
          <BookingNotification />

          <div className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
            <DashboardHeader />
          </div>

          <div className="mx-auto max-w-[1700px] p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
