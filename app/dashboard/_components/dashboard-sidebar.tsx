"use client"

import Link from "next/link"

import {
  CalendarDays,
  LayoutDashboard,
  Users,
  Wallet,
  BarChart3,
  Settings,
  Scissors,
} from "lucide-react"

import Image from "next/image"

import { usePathname } from "next/navigation"

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Agendamentos",
    href: "/dashboard/appointments",
    icon: CalendarDays,
  },

  {
    label: "Clientes",
    href: "/dashboard/clients",
    icon: Users,
  },

  {
    label: "Financeiro",
    href: "/dashboard/financials",
    icon: Wallet,
  },

  {
    label: "Relatórios",
    href: "/dashboard/reports",
    icon: BarChart3,
  },

  {
    label: "Serviços",
    href: "/dashboard/services",
    icon: Scissors,
  },

  {
    label: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const DashboardSidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="hidden h-screen w-[280px] shrink-0 border-r border-zinc-800 bg-[#0d0d10] lg:flex lg:flex-col">
      {/* topo */}
      <div className="flex items-center gap-3 border-b border-zinc-800 p-5">
        <Image src="/logkn.png" alt="Logo" width={45} height={45} />

        <div>
          <h1 className="text-lg font-bold text-white">KN Barber</h1>

          <p className="text-xs text-zinc-500">Painel Administrativo</p>
        </div>
      </div>

      {/* menu */}
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon

          const active = pathname === link.href

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`transition-transform duration-200 ${
                  active ? "scale-110" : "group-hover:translate-x-1"
                }`}
              />

              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSidebar
