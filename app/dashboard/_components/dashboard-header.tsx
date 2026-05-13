"use client"

import { Bell, Search } from "lucide-react"
import { Avatar, AvatarImage } from "@/app/_components/ui/avatar"
import { Input } from "@/app/_components/ui/input"
import { useSession } from "next-auth/react"

const DashboardHeader = () => {
  const { data } = useSession()

  return (
    <header className="flex items-center justify-between px-6 py-3">
      <div>
        <h1 className="text-x1 font-bold text-white">Dashboard</h1>

        <p className="text-sm text-zinc-400">Gerencie sua barbearia</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <Input
            placeholder="Buscar cliente..."
            className="w-[280px] border-zinc-800 bg-zinc-900 pl-10"
          />
        </div>

        <button className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 transition hover:bg-zinc-800">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">
          <Avatar>
            <AvatarImage src={data?.user?.image ?? ""} />
          </Avatar>

          <div className="hidden md:block">
            <p className="text-sm font-medium">{data?.user?.name}</p>

            <p className="text-xs text-zinc-500">{data?.user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DashboardHeader
