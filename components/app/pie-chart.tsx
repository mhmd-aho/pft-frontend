import { Card, CardContent,CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getUser } from "@/lib/user";
import { format } from "@/lib/utils";
import { ChartDisplay } from "./chart-display"

export default async function ChartPieDonutText() {
  const auth = await getUser();
  
  if (!auth || !auth.profileData) {
    return (
      <Card className="...">
        <CardContent><p className="text-center py-10">Please login to view data</p></CardContent>
      </Card>
    );
  }

  // 1. Fetch transactions on the server
  const res = await fetch(`http://127.0.0.1:8000/api/transactions/${auth.profileData.id}/monthly/`, {
    headers: { Authorization: `Token ${auth.token}` },
    next: { revalidate: 60 } 
  });
  
  const data = await res.json();
  const transactions = Array.isArray(data) ? data : (data.results || []);

  // 2. Perform Calculations on the server
  const totalExpenses = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((acc: number, t: any) => acc + Number(t.amount), 0);

  const totalIncome = transactions
    .filter((t: any) => t.type === "income")
    .reduce((acc: number, t: any) => acc + Number(t.amount), 0);

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
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        savings={savings}
        savingsPercentage={savingsPercentage}
        formattedTotalIncome={formattedTotalIncome}
      />
    </Card>
  );
}