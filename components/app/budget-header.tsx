import { Card, CardContent } from "../ui/card"; 
import { format } from "@/lib/utils";
export default async function BudgetHeader({totalExpenses,totalIncomes}: {totalExpenses: number,totalIncomes: number}) {  
    const savings = totalIncomes > totalExpenses ? totalIncomes - totalExpenses : 0;
    const formattedTotalIncome = format.format(totalIncomes);
    const formattedTotalExpenses = format.format(totalExpenses);
    const formattedSavings = format.format(savings);
    return (
        <Card className="col-start-1 col-span-6 row-start-1 bg-muted-foreground text-background">
                <CardContent className="flex justify-around items-center max-sm:p-0 ">
                    <div>
                        <h1 className="sm:text-3xl text-lg">Total Income</h1>
                        <h3 className="sm:text-lg text-sm text-center">{formattedTotalIncome}</h3>
                    </div>
                    <div>
                        <h1 className="sm:text-3xl text-lg">Total Expenses</h1>
                        <h3 className="sm:text-lg text-sm text-center">{formattedTotalExpenses}</h3>
                    </div>
                    <div>
                        <h1 className="sm:text-3xl text-lg">Total Savings</h1>
                        <h3 className="sm:text-lg text-sm text-center">{formattedSavings}</h3>
                    </div>
                </CardContent>
        </Card>
    );
}