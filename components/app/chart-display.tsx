"use client"

import { Pie, PieChart, Label } from "recharts"
import { CardContent } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { TrendingUp } from "lucide-react"
import { Progress } from "../ui/progress"
import { Field, FieldLabel } from "../ui/field"
import { BudgetType, TransactionType } from "@/lib/schemas"
import { format } from "@/lib/utils";

const chartConfig = {
  Expenses: { label: "Expenses" },
  Savings: { label: "Savings" },
} satisfies ChartConfig

interface ChartDisplayProps {
  expenses : TransactionType[],
  incomes: TransactionType[],
  budgets: BudgetType[]
}

export function ChartDisplay({ expenses,incomes,budgets}: ChartDisplayProps) {
  const totalExpenses =  expenses.reduce((acc:number, t:TransactionType)=>acc+Number(t.amount),0)
  const totalIncome = incomes.reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);
  const savings = totalIncome > totalExpenses ? totalIncome - totalExpenses : 0;
  const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
  const formattedTotalIncome = format.format(totalIncome);
  const chartData = [
    { label: "Expenses", value: totalExpenses, fill: "var(--chart-1)" },
    { label: "Savings", value: savings, fill: "var(--chart-5)" }
  ]
  let budgetsToShow: BudgetType[] = [];
  if(budgets.length > 2){
    budgetsToShow = budgets.slice(0,2)
  }else{
    budgetsToShow = budgets
  }
  return (
      <CardContent className="flex-1 pb-0 flex flex-col gap-10 items-center">
        <div className="flex flex-col items-center">
          <ChartContainer config={chartConfig} className="mx-auto aspect-squareh h-[200px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={60} strokeWidth={5}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-bold">
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
          <div className="flex items-center gap-2 leading-none font-medium">
            You are saving {savingsPercentage.toFixed(2)}% from your income <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          {
            budgetsToShow.length >0 &&
            budgetsToShow.map((budget)=>{
               const budgetExpenses = expenses.filter(t=>t.category.name=== budget.category.name).reduce(((acc:number,t:TransactionType)=>acc+t.amount),0)
               const formatetExpenses = format.format(budgetExpenses)
               const formatetBudgetAmount = format.format(budget.amount)
               const progress = (budgetExpenses/budget.amount)*100;
               return(
                  <Field key={budget.id}>
                    <FieldLabel>
                      <p>{budget.category.name}</p>
                      <p>{formatetExpenses} / {formatetBudgetAmount}</p>
                    </FieldLabel>
                    <Progress value={progress} />
                  </Field>
               )})
          }
        </div>
      </CardContent>
  )
}