import { MapPinIcon, StarIcon } from "lucide-react"

interface BarbershopActionsProps {
  abertoAgora: boolean
  barbershop: {
    name: string
    address: string
  }
}

const BarbershopActions = ({
  abertoAgora,
  barbershop,
}: BarbershopActionsProps) => {
  return (
    <div className="relative z-10 -mt-6 rounded-t-[32px] bg-background px-5 pt-5">
      {/* STATUS */}
      <div className="absolute right-4 top-5">
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-md ${
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
      </div>

      {/* Badges */}
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-[28px] items-center gap-1 rounded-md px-2 shadow-lg backdrop-blur-md">
          <StarIcon
            size={13}
            className="relative top-[-1px] fill-yellow-500/30 stroke-[2.5] text-yellow-500"
          />

          <span className="text-[12px] font-bold leading-none text-white">
            4.9
          </span>
        </div>

        <div className="flex h-[28px] items-center rounded-md px-2 backdrop-blur-md">
          <span className="text-[12px] font-bold leading-none text-white">
            70 avaliações
          </span>
        </div>
      </div>

      {/* Nome */}
      <h1 className="text-[23px] font-bold leading-tight tracking-tight text-white">
        {barbershop.name}
      </h1>

      {/* Endereço */}
      <div className="mt-2 flex items-center gap-1.5">
        <MapPinIcon className="text-white/90" size={14} />

        <p className="text-[13px] text-zinc-200">{barbershop.address}</p>
      </div>
    </div>
  )
}

export default BarbershopActions
