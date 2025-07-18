
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { day: "Seg", atendimentos: 186, agendamentos: 80 },
  { day: "Ter", atendimentos: 305, agendamentos: 200 },
  { day: "Qua", atendimentos: 237, agendamentos: 120 },
  { day: "Qui", atendimentos: 273, agendamentos: 190 },
  { day: "Sex", atendimentos: 209, agendamentos: 130 },
  { day: "Sáb", atendimentos: 214, agendamentos: 140 },
  { day: "Dom", atendimentos: 150, agendamentos: 90 },
]

const chartConfig = {
  atendimentos: {
    label: "Atendimentos",
    color: "hsl(var(--chart-2))",
  },
  agendamentos: {
    label: "Agendamentos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Atendimentos por Dia</CardTitle>
          <CardDescription>Volume de conversas iniciadas na última semana.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="atendimentos" fill="var(--color-atendimentos)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos por Dia</CardTitle>
          <CardDescription>Volume de agendamentos confirmados na última semana.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="agendamentos" fill="var(--color-agendamentos)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
