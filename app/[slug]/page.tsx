""

import BarbershopActions from "@/app/_components/barbershop-actions"
import BarbershopTabs from "@/app/_components/BarbershopTabs"
import ServiceItem from "@/app/_components/services.item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { Button } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"
import {
  ChevronLeftIcon,
  MenuIcon,
  CreditCard,
  Wallet,
  Banknote,
  Instagram,
  Facebook,
  Share2,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

import Link from "next/link"
import { notFound } from "next/navigation"
import { BarbershopCarousel } from "../_components/perfil-carrocel"

interface BarbershopPageProps {
  params: {
    slug: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      services: true,
      barbers: true, // ← ADICIONADO
    },
  })

  if (!barbershop) {
    return notFound()
  }

  const horarios = [
    { dia: "Domingo", abre: null, fecha: null },
    { dia: "Segunda-feira", abre: "09:00", fecha: "20:00" },
    { dia: "Terça-feira", abre: "09:00", fecha: "20:00" },
    { dia: "Quarta-feira", abre: "09:00", fecha: "20:00" },
    { dia: "Quinta-feira", abre: "09:00", fecha: "20:00" },
    { dia: "Sexta-feira", abre: "09:00", fecha: "20:00" },
    { dia: "Sábado", abre: "09:00", fecha: "20:00" },
  ]

  const agora = new Date()

  // Brasil (evita bug de timezone do servidor)
  const diaAtual = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    timeZone: "America/Sao_Paulo",
  })

  const horaAtual = agora.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  })

  const horarioHoje = horarios.find((h) => h.dia.toLowerCase() === diaAtual)

  const abertoAgora = Boolean(
    horarioHoje?.abre &&
    horarioHoje?.fecha &&
    horaAtual >= horarioHoje.abre &&
    horaAtual <= horarioHoje.fecha,
  )

  return (
    <div>
      {/* IMAGEM */}
      <div className="relative h-[260px] w-full overflow-hidden">
        <BarbershopCarousel
          name={barbershop.name}
          images={[
            "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWwIkBasR1vFVGUDya7QPK0kNcZr8AXfeWhMSn",
            "https://xd90tgazad.ufs.sh/f/r9YwIz1ulNCWqpDzANdwUyoZv4s35M6KNmVDp7diLuq8gW1R",
          ]}
        />

        {/* Overlay premium */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Botão voltar */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute left-4 top-4 z-20 border border-white/10 bg-black/40 backdrop-blur-md"
          asChild
        >
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>

        {/* Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-4 z-20 border-white/10 bg-black/40 backdrop-blur-md"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>

          <SidebarSheet />
        </Sheet>

        {/* Conteúdo inferior */}
      </div>

      {/* INFO / ACTIONS / TITULO */}
      <BarbershopActions abertoAgora={abertoAgora} barbershop={barbershop} />

      {/* SERVIÇOS TABS */}
      <BarbershopTabs
        services={
          <div className="-mt-9 space-y-3 border-b border-solid p-5">
            <h2 className="text-xs font-bold uppercase text-gray-400">
              Serviços
            </h2>

            <div className="space-y-3">
              {barbershop.services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={JSON.parse(JSON.stringify(service))}
                  barbershop={{
                    name: barbershop.name,
                  }}
                  barbers={JSON.parse(JSON.stringify(barbershop.barbers))}
                />
              ))}
            </div>
          </div>
        }
        combos={
          <div className="-mt-9 p-5">
            <h2 className="text-xs font-bold uppercase text-gray-400">
              Combos
            </h2>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Nenhum combo disponível.
            </div>
          </div>
        }
        gallery={
          <div className="-mt-9 p-5">
            <h2 className="text-xs font-bold uppercase text-gray-400">
              Galeria
            </h2>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Nenhuma imagem disponível.
            </div>
          </div>
        }
        specialists={
          <div className="-mt-9 p-5">
            <h2 className="text-xs font-bold uppercase text-gray-400">
              Especialistas
            </h2>

            <div className="mt-4 space-y-3">
              {barbershop.barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <p className="font-semibold text-white">{barber.name}</p>
                </div>
              ))}
            </div>
          </div>
        }
        reviews={
          <div className="-mt-9 p-5">
            <h2 className="text-xs font-bold uppercase text-gray-400">
              Avaliações
            </h2>

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center text-zinc-400">
              Nenhuma avaliação disponível.
            </div>
          </div>
        }
      />

      {/* HORÁRIO DE FUNCIONAMENTO */}
      {/* Título */}
      <div className="mt-7 border-b border-solid px-5 pb-2">
        <div className="mb-1 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-[15px] font-semibold text-white">
            Horário de atendimento
          </h2>
        </div>

        <div className="rounded-2xl px-3 py-5">
          <div className="space-y-4">
            {horarios.map((item) => {
              const hoje = item.dia.toLowerCase() === diaAtual

              return (
                <div
                  key={item.dia}
                  className="flex items-center justify-between"
                >
                  {/* ESQUERDA */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        item.abre ? "bg-green-500" : "bg-red-500"
                      }`}
                    />

                    <span className="text-sm text-zinc-300">{item.dia}</span>

                    {hoje && (
                      <span className="rounded-full bg-emerald-900/40 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                        Hoje
                      </span>
                    )}
                  </div>

                  {/* DIREITA */}
                  <span
                    className={`text-sm font-medium ${
                      item.abre ? "text-zinc-400" : "text-red-400"
                    }`}
                  >
                    {item.abre ? `${item.abre} - ${item.fecha}` : "Fechado"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FORMAS DE PAGAMENTO */}
      <div className="border-b border-zinc-800 px-5 py-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <CreditCard className="h-4 w-4 text-white" />
          </div>

          <h2 className="text-[15px] font-semibold text-white">
            Formas de pagamento
          </h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { icon: Wallet, label: "Dinheiro" },
            { icon: CreditCard, label: "Cartão de Crédito" },
            { icon: CreditCard, label: "Cartão de Débito" },
            { icon: Banknote, label: "PIX" },
            { icon: CreditCard, label: "Mastercard" },
            { icon: CreditCard, label: "Elo" },
            { icon: CreditCard, label: "Visa" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* REDES SOCIAIS */}
      <div className="px-5 py-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <Share2 className="h-4 w-4 text-white" />
          </div>

          <h2 className="text-[15px] font-semibold text-white">
            Redes Sociais
          </h2>
        </div>

        <div className="flex gap-3">
          <a
            href="https://wa.me/5593999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
          >
            <FaWhatsapp className="text-[26px] text-green-500" />
          </a>

          <a
            href="https://instagram.com/seuinstagram"
            target="_blank"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 transition hover:border-pink-500 hover:bg-zinc-800"
          >
            <Instagram className="h-5 w-5 text-pink-500" />
          </a>

          <a
            href="https://facebook.com/suapagina"
            target="_blank"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 transition hover:border-blue-500 hover:bg-zinc-800"
          >
            <Facebook className="h-6 w-6 text-blue-500" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default BarbershopPage
