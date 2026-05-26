import { MapPinIcon } from "lucide-react"
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa"

const BarbershopActions = () => {
  return (
    <div className="relative z-10 -mt-6 rounded-t-[30px] bg-background px-1 pt-5">
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
    </div>
  )
}

export default BarbershopActions
