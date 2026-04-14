"use client"

import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useProfile } from "@/context/Profile";
import { useMemo, useState, useEffect } from "react";
import { getUserMonthlyTransactions } from "@/app/actions";
import type { TransactionType } from "@/lib/schemas";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"


export const description = "A donut chart with text"



const chartConfig = {
  Expenses: {
    label: "Expenses",
  },
  Savings: {
    label: "Savings",
  },
} satisfies ChartConfig

export function ChartPieDonutText() {
  const {profile} = useProfile();
  const [transactions,setTransactions] = useState<TransactionType[]>([]);
  const totalExpenses = useMemo(() => {
    return transactions.filter(t=>t.type==="expense").reduce((acc,transaction) => acc + Number(transaction.amount),0);
  },[transactions]);
  const balance = useMemo(() => {
    return transactions.filter(t=>t.type==="income").reduce((acc,transaction) => acc + Number(transaction.amount),0);
  },[transactions]);
  useEffect(() => {
    if(profile){
      const fetchTransactions = async () => {
        const response = await getUserMonthlyTransactions(profile.id);
        if(response.success){
          setTransactions(response.data);
        }
      }
      fetchTransactions();
    }
  },[profile]);
  if(!profile){
    return <div>Loading...</div>
  }
  const savings = Number(balance) - Number(totalExpenses);
  let savingsPercentage = (Number(savings) / Number(balance)) * 100;
  if(transactions.length === 0){
  
    savingsPercentage = 0
  }
  const chartData = [
  {label:"Expenses",value:Number(totalExpenses),fill:"var(--chart-1)"},
  {label:"Savings",value:Number(savings),fill:"var(--chart-5)"}
]
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>This Month</CardTitle>
        <CardDescription>{new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              innerRadius={60}
              strokeWidth={5}
              startAngle={90}
              endAngle={450}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {balance}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
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
          You are saving  {savingsPercentage.toFixed(2)}% from your income <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total income for this month
        </div>
      </CardFooter>
    </Card>
  )
}
