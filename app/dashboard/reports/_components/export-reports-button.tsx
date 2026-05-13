"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { Download } from "lucide-react"

interface ExportReportsButtonProps {
  totalRevenue: number
  totalBookings: number
  averageTicket: number
  uniqueClients: number

  servicesRanking: {
    name: string
    total: number
    revenue: number
  }[]
}

const ExportReportsButton = ({
  totalRevenue,
  totalBookings,
  averageTicket,
  uniqueClients,
  servicesRanking,
}: ExportReportsButtonProps) => {
  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text("Relatório da Barbearia", 14, 20)

    doc.setFontSize(12)

    doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30)

    doc.text(
      `Receita Mensal: R$ ${totalRevenue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      14,
      45,
    )

    doc.text(`Agendamentos: ${totalBookings}`, 14, 55)

    doc.text(
      `Ticket Médio: R$ ${averageTicket.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      14,
      65,
    )

    doc.text(`Clientes: ${uniqueClients}`, 14, 75)

    autoTable(doc, {
      startY: 90,

      head: [["Serviço", "Agendamentos", "Faturamento"]],

      body: servicesRanking.map((service) => [
        service.name,
        service.total,
        `R$ ${service.revenue.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
      ]),
    })

    doc.save("relatorio-barbearia.pdf")
  }

  return (
    <button
      onClick={handleExportPDF}
      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-medium text-white transition-all hover:scale-[1.02]"
    >
      <Download size={18} />
      Exportar Relatório
    </button>
  )
}

export default ExportReportsButton
