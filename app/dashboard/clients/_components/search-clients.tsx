"use client"

import { Search } from "lucide-react"

import { usePathname, useRouter } from "next/navigation"

import { useEffect, useState } from "react"

const SearchClients = () => {
  const router = useRouter()

  const pathname = usePathname()

  const [search, setSearch] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.trim()) {
        router.replace(`${pathname}?search=${search}`, {
          scroll: false,
        })
      } else {
        router.replace(pathname, {
          scroll: false,
        })
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [search, router, pathname])

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar cliente..."
        className="w-[320px] rounded-2xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition-all focus:border-emerald-500"
      />
    </div>
  )
}

export default SearchClients
