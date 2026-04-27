import { Card, CardContent } from "../ui/card"; 
import { format } from "@/lib/utils";
export default async function BudgetHeader({totalExpenses,totalIncomes}: {totalExpenses: number,totalIncomes: number}) {  
    const savings = totalIncomes > totalExpenses ? totalIncomes - totalExpenses : 0;
    const formattedTotalIncome = format.format(totalIncomes);
    const formattedTotalExpenses = format.format(totalExpenses);
    const formattedSavings = format.format(savings);
    return (
        <Card className="col-start-1 col-span-6 row-start-1 bg-muted-foreground text-background">
                <CardContent className="flex max-sm:flex-col justify-around items-center max-sm:p-0 ">
                    <div className="flex sm:flex-col justify-between sm:justify-center max-sm:w-full max-sm:p-2">
                        <h2 className="lg:text-3xl sm:text-lg text-base">Total Income</h2>
                        <h3 className="lg:text-lg sm:text-base text-sm text-center">{formattedTotalIncome}</h3>
                    </div>
                    <div className="flex sm:flex-col justify-between sm:justify-center max-sm:w-full max-sm:p-2">
                        <h2 className="lg:text-3xl sm:text-lg text-base">Total Expenses</h2>
                        <h3 className="lg:text-lg sm:text-base text-sm text-center">{formattedTotalExpenses}</h3>
                    </div>
                    <div className="flex sm:flex-col justify-between sm:justify-center max-sm:w-full max-sm:p-2">
                        <h2 className="lg:text-3xl sm:text-lg text-base">Total Savings</h2>
                        <h3 className="lg:text-lg sm:text-base text-sm text-center">{formattedSavings}</h3>
                    </div>
                </CardContent>
        </Card>
    );
}