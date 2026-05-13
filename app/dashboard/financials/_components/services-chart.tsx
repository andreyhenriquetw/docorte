"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface ServicesChartProps {
  data: {
    name: string
    quantity: number
    total: number
  }[]
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"]

const ServicesChart = ({ data }: ServicesChartProps) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="quantity"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={110}
            innerRadius={70}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ServicesChart
