"use client"

import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { MapPinIcon, StarIcon, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface BarberShopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarberShopItemProps) => {
  const [isLoading, setIsLoading] = useState(false)

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

          <Button
            variant="secondary"
            className="relative mt-3 h-full w-full overflow-hidden p-[1.2px]"
            disabled={isLoading}
            onClick={() => setIsLoading(true)}
            asChild={!isLoading}
          >
            {isLoading ? (
              <div className="z-10 flex h-full w-full items-center justify-center gap-2 bg-secondary py-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#EAB308]" />
                <span className="text-sm font-semibold uppercase"></span>
              </div>
            ) : (
              <Link
                href={`/barbershops/${barbershop.id}`}
                className="relative flex h-full w-full items-center justify-center"
              >
                <div
                  className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite]"
                  style={{
                    background:
                      "conic-gradient(from 90deg at 50% 50%, transparent 0%, #EAB308 20%, transparent 40%)",
                  }}
                />

                <div className="z-10 flex h-full w-full items-center justify-center gap-2 rounded-[calc(var(--radius)-1px)] bg-secondary px-4 py-2">
                  <span className="font-semibold uppercase tracking-tight">
                    RESERVE NOW
                  </span>
                  <span className="text-sm uppercase opacity-70">
                    AGENDAR AGORA
                  </span>
                </div>
              </Link>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
