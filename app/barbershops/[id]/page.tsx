import BarbershopActions from "@/app/_components/barbershop-actions"
import BarbershopTabs from "@/app/_components/BarbershopTabs"
import ServiceItem from "@/app/_components/services.item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { Button } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

interface BarbershopPageProps {
  params: {
    id: string
  }
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
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
    { dia: "Sábado", abre: "10:00", fecha: "20:00" },
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

  const abertoAgora =
    horarioHoje?.abre &&
    horarioHoje?.fecha &&
    horaAtual >= horarioHoje.abre &&
    horaAtual <= horarioHoje.fecha

  return (
    <div>
      {/* IMAGEM */}
      <div className="relative h-[300px] w-full overflow-hidden">
        <Image
          alt={barbershop.name}
          src={barbershop.imageUrl}
          fill
          className="object-cover"
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
        <div className="absolute bottom-8 left-5 z-20">
          {/* STATUS */}
          <div
            className={`mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-md ${
              abertoAgora
                ? "border-emerald-500/20 bg-black/30"
                : "border-red-500/20 bg-black/30"
            }`}
          >
            {/* luz animada */}
            <div className="relative flex h-2.5 w-2.5 items-center justify-center">
              <div
                className={`absolute h-2.5 w-2.5 animate-ping rounded-full opacity-75 ${
                  abertoAgora ? "bg-emerald-400" : "bg-red-400"
                }`}
              />

              <div
                className={`relative h-2.5 w-2.5 rounded-full ${
                  abertoAgora
                    ? "bg-emerald-400 shadow-[0_0_10px_#4ade80]"
                    : "bg-red-400 shadow-[0_0_10px_#f87171]"
                }`}
              />
            </div>

            <span
              className={`text-[12px] font-semibold ${
                abertoAgora ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {abertoAgora ? "Aberto agora" : "Fechado"}
            </span>
          </div>
          {/* Badges */}
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-[28px] items-center gap-1 rounded-md px-2 shadow-lg backdrop-blur-md">
              <StarIcon
                className="fill-transparent stroke-[2.3] text-yellow-500"
                size={11}
              />
              <span className="text-[12px] font-bold text-white">4.9</span>
            </div>

            <div className="flex h-[28px] items-center rounded-md px-2 backdrop-blur-md">
              <span className="fill-transparent stroke-[2.3] text-[12px] font-bold text-white">
                70 avaliações
              </span>
            </div>
          </div>

          {/* Nome */}
          <h1 className="text-[23px] font-bold leading-tight tracking-tight text-white drop-shadow-lg">
            {barbershop.name}
          </h1>

          {/* Endereço + Status */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="text-white/90" size={14} />

              <p className="text-[13px] text-zinc-200">{barbershop.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* INFO / ACTIONS / TITULO */}
      <BarbershopActions />

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
      <div className="mt-7 px-5 pb-6">
        <div className="mb-4 flex items-center gap-2">
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
            Horário de funcionamento
          </h2>
        </div>
        <div className="rounded-[24px] border border-zinc-800 bg-zinc-950/70 p-4 shadow-lg backdrop-blur-md">
          {/* Dias */}
          <div className="space-y-2">
            {horarios.map((item) => {
              const hoje = item.dia.toLowerCase() === diaAtual

              return (
                <div
                  key={item.dia}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    hoje
                      ? "border-zinc-600 bg-zinc-800/70 shadow-md"
                      : "border-zinc-900 bg-zinc-900/60"
                  }`}
                >
                  {/* esquerda */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        item.abre ? "bg-lime-400" : "bg-red-400"
                      }`}
                    />

                    <span className="text-[14px] font-medium text-amber-400">
                      {item.dia}
                    </span>

                    {hoje && (
                      <span className="rounded-md bg-zinc-600 px-2 py-[2px] text-[10px] font-semibold text-white">
                        Hoje
                      </span>
                    )}
                  </div>

                  {/* direita */}
                  <span
                    className={`text-[14px] font-semibold ${
                      item.abre ? "text-amber-400" : "text-red-400"
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
    </div>
  )
}

export default BarbershopPage
