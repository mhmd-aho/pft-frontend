"use client"

import { Loader2, TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import { useProfile } from "@/context/Profile";
import { useMemo, useState, useEffect, useTransition } from "react";
import { getUserMonthlyTransactions } from "@/app/actions";
import type { TransactionType } from "@/lib/schemas";
import { format } from "@/lib/utils";

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
import { toast } from "sonner";




const chartConfig = {
  Expenses: {
    label: "Expenses",
  },
  Savings: {
    label: "Savings",
  },
} satisfies ChartConfig

export function ChartPieDonutText() {
  const {profile,loading} = useProfile();
  const [transactions,setTransactions] = useState<TransactionType[]>([]);
  const totalExpenses = Number(useMemo(() => {
    return transactions.filter(t=>t.type==="expense").reduce((acc,transaction) => acc + Number(transaction.amount),0);
  },[transactions]));
  const totalIncome = Number(useMemo(() => {
    return transactions.filter(t=>t.type==="income").reduce((acc,transaction) => acc + Number(transaction.amount),0);
  },[transactions]));
  const [isPending,startTransition] = useTransition();
  useEffect(() => {
    if(profile){
      const fetchTransactions = () => {
        startTransition(async () => {
        const response = await getUserMonthlyTransactions(profile.id);
        if(response.success){
          setTransactions(response.data);
        }else{
          toast.error(response.error);
        }
      });
      }
      fetchTransactions();
    }
  },[profile]);
  
  const savings = totalExpenses > totalIncome ? 0 : totalIncome - totalExpenses;
  let savingsPercentage = totalExpenses > totalIncome ? 0 : (savings / totalIncome) * 100;
  if(transactions.length === 0){
  
    savingsPercentage = 0
  }
  const chartData = [
  {label:"Expenses",value:Number(totalExpenses),fill:"var(--chart-1)"},
  {label:"Savings",value:Number(savings),fill:"var(--chart-5)"}
]
const formattedTotalIncome = format.format(totalIncome);
  return (
    <Card className="flex flex-col col-start-1 sm:col-end-4 sm:row-start-2 sm:row-end-6 row-start-3 row-end-8 max-sm:col-span-2 max-sm:gap-1 max-sm:py-1">
      <CardHeader className="items-center pb-0">
        <CardTitle className="sm:text-3xl text-xl">This Month</CardTitle>
        <CardDescription>{new Date().toLocaleDateString('en-US',{month:'long',year:'numeric'})}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {isPending || loading ? (
            <Loader2 className="size-52 animate-spin m-auto" />
        ) : (
          !profile ? (
            <p>No profile found</p>
          ) : (
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
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formattedTotalIncome}
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
        ))}
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
