import { Card,CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { getUser } from "@/lib/user";
import { format } from "@/lib/utils";
import { ChartDisplay } from "./chart-display"
import { TransactionType } from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
import { Button } from "../ui/button";
import Link from "next/link";
export default async function Savings() {
  const profileData = await getUser();
  
  if (typeof profileData === 'string')  {
    return null;
  }

  const res = await serverFetch(`/api/transactions/${profileData.id}/monthly/`, {
    next: { tags: ['transactions'] } 
  });
  
  const data = await res.json();
  const transactions = Array.isArray(data) ? data : (data.results || []);

  const totalExpenses = transactions
    .filter((t: TransactionType) => t.type === "expense")
    .reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);

  const totalIncome = transactions
    .filter((t: TransactionType) => t.type === "income")
    .reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);

  const savings = totalIncome > totalExpenses ? totalIncome - totalExpenses : 0;
  const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
  const formattedTotalIncome = format.format(totalIncome);

  return (
    <Card className="flex flex-col col-start-1 sm:col-end-4 sm:row-start-2 sm:row-end-6 row-start-3 row-end-8 max-sm:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="sm:text-3xl text-xl">This Month</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>

      <ChartDisplay 
        totalExpenses={totalExpenses}
        savings={savings}
        savingsPercentage={savingsPercentage}
        formattedTotalIncome={formattedTotalIncome}
      />
      <CardFooter className="flex justify-end shrink-0">
        <Button  className="max-sm:w-full" asChild>
          <Link href="/dashboard/budget">
            View all categories
          </Link>
          </Button>
      </CardFooter>
    </Card>
  );
}