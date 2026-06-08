"use client"

import { useState } from "react"

type Tab = "services" | "combos" | "gallery" | "specialists" | "reviews"

interface BarbershopTabsProps {
  services: React.ReactNode
  combos?: React.ReactNode
  gallery?: React.ReactNode
  specialists?: React.ReactNode
  reviews?: React.ReactNode
}

const BarbershopTabs = ({
  services,
  combos,
  gallery,
  specialists,
  reviews,
}: BarbershopTabsProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("services")

  return (
    <div>
      {/* MENU */}
      <div className="sticky top-0 z-30 bg-background p-5">
        <div className="hide-scrollbar flex items-center gap-6 overflow-x-auto border-b border-zinc-800 py-4">
          <button
            onClick={() => setActiveTab("services")}
            className={`relative whitespace-nowrap text-sm font-semibold ${
              activeTab === "services" ? "text-white" : "text-zinc-400"
            }`}
          >
            Serviços
            {activeTab === "services" && (
              <div className="absolute -bottom-4 left-0 h-[3px] w-full rounded-full bg-primary" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("combos")}
            className={`relative whitespace-nowrap text-sm font-semibold ${
              activeTab === "combos" ? "text-white" : "text-zinc-400"
            }`}
          >
            Assinatura
            {activeTab === "combos" && (
              <div className="absolute -bottom-4 left-0 h-[3px] w-full rounded-full bg-primary" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`relative whitespace-nowrap text-sm font-semibold ${
              activeTab === "gallery" ? "text-white" : "text-zinc-400"
            }`}
          >
            Galeria
            {activeTab === "gallery" && (
              <div className="absolute -bottom-4 left-0 h-[3px] w-full rounded-full bg-primary" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("specialists")}
            className={`relative whitespace-nowrap text-sm font-semibold ${
              activeTab === "specialists" ? "text-white" : "text-zinc-400"
            }`}
          >
            Especialistas
            {activeTab === "specialists" && (
              <div className="absolute -bottom-4 left-0 h-[3px] w-full rounded-full bg-primary" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`relative whitespace-nowrap text-sm font-semibold ${
              activeTab === "reviews" ? "text-white" : "text-zinc-400"
            }`}
          >
            Avaliações
            {activeTab === "reviews" && (
              <div className="absolute -bottom-4 left-0 h-[3px] w-full rounded-full bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="mt-5">
        {activeTab === "services" && services}

        {activeTab === "combos" && combos}

        {activeTab === "gallery" && gallery}

        {activeTab === "specialists" && specialists}

        {activeTab === "reviews" && reviews}
      </div>
    </div>
  )
}

export default BarbershopTabs
