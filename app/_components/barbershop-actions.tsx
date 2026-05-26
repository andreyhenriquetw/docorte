import { MapPinIcon } from "lucide-react"
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa"

const BarbershopActions = () => {
  return (
    <div className="relative z-10 -mt-6 rounded-t-[32px] bg-background px-5 pt-5">
      {/* icones */}
      <div className="-mt-1 flex items-center justify-between gap-3">
        <button className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <FaWhatsapp size={22} className="text-green-500" />
          </div>

          <span className="text-[12px] text-zinc-300">WhatsApp</span>
        </button>

        <button className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <FaInstagram size={22} className="text-pink-500" />
          </div>

          <span className="text-[12px] text-zinc-300">Instagram</span>
        </button>

        <button className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <FaFacebookF size={20} className="text-blue-500" />
          </div>

          <span className="text-[12px] text-zinc-300">Facebook</span>
        </button>

        <button className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
            <MapPinIcon size={22} className="text-red-500" />
          </div>

          <span className="text-[12px] text-zinc-300">Localização</span>
        </button>
      </div>

      {/* menu fixo */}
      <div className="sticky top-0 z-30 mt-4 border-b border-zinc-800 bg-background">
        <div className="hide-scrollbar flex items-center gap-6 overflow-x-auto py-4">
          <button className="relative whitespace-nowrap text-sm font-semibold text-white">
            Serviços
            <div className="absolute -bottom-4 left-0 h-[3px] w-full rounded-full bg-primary" />
          </button>

          <button className="whitespace-nowrap text-sm text-zinc-400">
            Combos
          </button>

          <button className="whitespace-nowrap text-sm text-zinc-400">
            Galeria
          </button>

          <button className="whitespace-nowrap text-sm text-zinc-400">
            Especialistas
          </button>

          <button className="whitespace-nowrap text-sm text-zinc-400">
            Avaliações
          </button>
        </div>
      </div>
    </div>
  )
}

export default BarbershopActions
