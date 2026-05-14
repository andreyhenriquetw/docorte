import { format } from "date-fns"
import { Card, CardContent } from "./ui/card"
import { Barbershop, BarbershopService } from "@prisma/client"
import { ptBR } from "date-fns/locale"

interface BookingSummaryProps {
  service: Pick<BarbershopService, "name" | "price">
  barbershop: Pick<Barbershop, "name">
  selectedDate: Date
}

const BookingSummary = ({ service, selectedDate }: BookingSummaryProps) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white">{service.name}</h2>

          <p className="text-sm font-bold text-green-500">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
          <h2 className="text-sm text-zinc-400">Data</h2>

          <p className="text-sm text-white">
            {format(selectedDate, "d 'de' MMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm text-zinc-400">Horário</h2>

          <p className="text-sm text-white">{format(selectedDate, "HH:mm")}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingSummary
