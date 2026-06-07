import { format } from "date-fns"
import { Card, CardContent } from "./ui/card"
import { Barbershop, BarbershopService } from "@prisma/client"
import { ptBR } from "date-fns/locale"

interface BookingSummaryProps {
  service: Pick<BarbershopService, "name" | "price">
  barbershop: Pick<Barbershop, "name">
  selectedDate: Date

  paymentMethod?: "pix" | "money" | null
  cashAmount?: string
}

const BookingSummary = ({
  service,
  selectedDate,
  paymentMethod,
  cashAmount,
}: BookingSummaryProps) => {
  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-sm text-zinc-400">Pagamento</h2>

          <p className="text-sm font-medium text-white">
            {paymentMethod === "pix"
              ? "Pix"
              : paymentMethod === "money"
                ? "Dinheiro"
                : "--"}
          </p>
        </div>

        {paymentMethod === "money" && cashAmount && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-zinc-400">Valor recebido</h2>

              <p className="text-sm text-white">R$ {cashAmount}</p>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-sm text-zinc-400">Troco</h2>

              <p className="text-sm font-semibold text-green-500">
                R$ {(Number(cashAmount) - Number(service.price)).toFixed(2)}
              </p>
            </div>
          </>
        )}

        {paymentMethod === "money" && cashAmount && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-zinc-400">Cliente pagará</h2>

              <p className="text-sm text-white">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(cashAmount))}
              </p>
            </div>
          </>
        )}

        <div className="flex items-start justify-between gap-3 pt-1">
          <div>
            <h2 className="font-bold text-white">{service.name}</h2>
          </div>

          <p className="shrink-0 text-sm font-bold text-green-500">
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
