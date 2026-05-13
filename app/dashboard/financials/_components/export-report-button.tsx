"use client"

import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ServiceRanking {
  name: string
  total: number
  quantity: number
}

interface ExportReportButtonProps {
  totalRevenue: number
  totalBookings: number
  averageTicket: number
  uniqueClients: number
  servicesRanking: ServiceRanking[]
}

const ExportReportButton = ({
  totalRevenue,
  totalBookings,
  averageTicket,
  uniqueClients,
  servicesRanking,
}: ExportReportButtonProps) => {
  const handleExportPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text("Relatório Financeiro", 14, 20)

    doc.setFontSize(11)

    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30)

    // resumo
    doc.setFontSize(14)

    doc.text("Resumo Geral", 14, 45)

    doc.setFontSize(11)

    doc.text(
      `Faturamento Mensal: R$ ${totalRevenue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      14,
      55,
    )

    doc.text(`Agendamentos: ${totalBookings}`, 14, 63)

    doc.text(
      `Ticket Médio: R$ ${averageTicket.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`,
      14,
      71,
    )

    doc.text(`Clientes no mês: ${uniqueClients}`, 14, 79)

    // tabela
    autoTable(doc, {
      startY: 95,

      head: [["Serviço", "Agendamentos", "Faturamento"]],

      body: servicesRanking.map((service) => [
        service.name,
        service.quantity,
        `R$ ${service.total.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`,
      ]),

      styles: {
        fontSize: 10,
      },

      headStyles: {
        fillColor: [16, 185, 129],
      },
    })

    doc.save(`relatorio-financeiro-Barbearia${Date.now()}.pdf`)
  }

  return (
    <button
      onClick={handleExportPDF}
      className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-medium text-white transition-all hover:scale-[1.02]"
    >
      Exportar Relatório
    </button>
  )
}

export default ExportReportButton
