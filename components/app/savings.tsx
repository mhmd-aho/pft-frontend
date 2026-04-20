import { Card,CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { getUser } from "@/lib/user";
import {SquareArrowOutUpRight} from "lucide-react";
import { ChartDisplay } from "./chart-display"
import { TransactionType,BudgetType } from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
import { Button } from "../ui/button";
import Link from "next/link";
export default async function Savings() {
  const profileData = await getUser();
  
  if (typeof profileData === 'string')  {
    return null;
  }

  const transactionRes = await serverFetch(`/api/transactions/${profileData.id}/monthly/`, {
    next: { tags: ['transactions'] } 
  });
  const transactionsData = await transactionRes.json();
  const transactions:TransactionType[] = transactionsData.results ;
  const budgetRes = await serverFetch(`/api/budgets/${profileData.id}/`,{next:{tags:['budgets']}});
    const budgetsData = await budgetRes.json();
    const budgets: BudgetType[] = budgetsData.results;
  const expenses = transactions.filter((t: TransactionType) => t.type === "expense")
  const incomes = transactions.filter((t: TransactionType) => t.type === "income")
  return (
    <Card className="flex flex-col col-start-1 sm:col-end-4 sm:row-start-2 sm:row-end-6 row-start-3 row-end-8 max-sm:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="sm:text-3xl text-xl">This Month</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>

      <ChartDisplay 
        expenses={expenses}
        budgets={budgets}
        incomes={incomes}
      />
      <CardFooter className="flex justify-end shrink-0">
        <Button  className="max-sm:w-full" asChild>
          <Link href="/dashboard/budget" className="flex items-center gap-1">
            <SquareArrowOutUpRight className="size-4" />
            View all categories
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}