import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { MapPinIcon, StarIcon } from "lucide-react"
import Link from "next/link"

interface BarberShopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarberShopItemProps) => {
  return (
    <Card className="w-full rounded-2xl sm:min-w-[300px]">
      <CardContent className="p-0 px-1 pb-2 pt-1">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full">
          <Image
            alt={barbershop.name}
            fill
            className="rounded-2xl object-cover"
            src={barbershop.imageUrl}
          />

          {/* ICONE STAR */}
          <Badge
            className="absolute left-2 top-2 space-x-1"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold">5,0</p>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="px-1 py-3">
          <div className="-mt-1 mb-3 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="relative size-[30px] shrink-0 overflow-hidden rounded-full">
                <Image
                  src="/ofckn.png"
                  alt="Logo da Barbearia"
                  fill
                  className="object-cover object-[50%_25%]"
                />
              </div>

              <p className="font-semibold leading-none tracking-tight">
                {barbershop.name}
              </p>
            </div>
          </div>
          <div className="-mt-1 flex items-center gap-2">
            <MapPinIcon size={16} />
            <p className="truncate text-sm text-gray-400">
              {barbershop?.address}
            </p>
          </div>
          <Button variant="secondary" className="mt-3 w-full" asChild>
            <Link href={`/barbershops/${barbershop.id}`}>
              <span>SCHEDULE NOW</span>
              <span className="text-sm opacity-70">AGENDAR AGORA</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
