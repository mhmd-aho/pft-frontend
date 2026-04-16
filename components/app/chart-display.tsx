"use client"

import { Pie, PieChart, Label } from "recharts"
import { CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"

const chartConfig = {
  Expenses: { label: "Expenses" },
  Savings: { label: "Savings" },
} satisfies ChartConfig

interface ChartDisplayProps {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsPercentage: number;
  formattedTotalIncome: string;
}

export function ChartDisplay({ totalIncome, totalExpenses, savings, savingsPercentage, formattedTotalIncome }: ChartDisplayProps) {
  const chartData = [
    { label: "Expenses", value: totalExpenses, fill: "var(--chart-1)" },
    { label: "Savings", value: savings, fill: "var(--chart-5)" }
  ]

  return (
    <>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                          {formattedTotalIncome}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total income
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          You are saving {savingsPercentage.toFixed(2)}% from your income <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </>
  )
}