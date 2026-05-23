import PhoneItem from "@/app/_components/phone-item"
import ServiceItem from "@/app/_components/services.item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { Button } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { UsersIcon, AwardIcon } from "lucide-react"
import { AnimatedCounter } from "@/app/_components/AnimatedCounter"

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

  return (
    <div>
      {/* IMAGEM */}
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
        <div className="absolute bottom-8 left-4 z-20">
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

          {/* Endereço */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <MapPinIcon className="text-white/90" size={14} />
            <p className="text-[13px] text-zinc-200">{barbershop.address}</p>
          </div>
        </div>
      </div>

      {/* TITULO */}
      <div className="relative z-10 -mt-6 rounded-t-[30px] border-b border-solid bg-background p-5">
        <div className="grid grid-cols-3 gap-3">
          {/* Avaliação */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-yellow-500/15 bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent p-3.5 shadow-sm backdrop-blur-md">
            <StarIcon
              className="mb-1.5 fill-transparent stroke-[2.2] text-yellow-400"
              size={17}
            />
            <span className="text-[22px] font-bold leading-none text-white">
              <AnimatedCounter value={4.9} decimals={1} />
            </span>
            <span className="mt-1 text-[13px] text-zinc-300">Avaliação</span>
          </div>

          {/* Clientes */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-500/15 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent p-3.5 shadow-sm backdrop-blur-md">
            <UsersIcon className="mb-1.5 text-blue-400" size={17} />
            <span className="text-[22px] font-bold leading-none text-white">
              <AnimatedCounter value={70} />
            </span>
            <span className="mt-1 text-[13px] text-zinc-300">Clientes</span>
          </div>

          {/* Anos */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent p-3.5 shadow-sm backdrop-blur-md">
            <AwardIcon className="mb-1.5 text-emerald-400" size={17} />
            <span className="text-[22px] font-bold leading-none text-white">
              <AnimatedCounter value={5} />+
            </span>
            <span className="mt-1 text-[13px] text-zinc-300">Anos</span>
          </div>
        </div>
      </div>

      {/* SERVIÇOS */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>

        <div className="space-y-3">
          {barbershop.services.map((service) => (
            <ServiceItem
              key={service.id}
              service={JSON.parse(JSON.stringify(service))}
              barbershop={{
                name: barbershop.name,
              }}
              barbers={JSON.parse(JSON.stringify(barbershop.barbers))} // ← ADICIONADO
            />
          ))}
        </div>
      </div>

      {/* CONTATO */}
      <div className="space-y-3 p-5">
        {barbershop.phones.map((phone) => (
          <PhoneItem key={phone} phone={phone} />
        ))}
      </div>
    </div>
  )
}

export default BarbershopPage
