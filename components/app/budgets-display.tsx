import { TransactionType,CategoryType,ProfileType,BudgetType } from "@/lib/schemas";
import AddBudget from "./add-budget";
import { serverFetch } from "@/lib/server-fetch";
import { BudgetCard } from "./budget-card";

export default async function BudgetsDisplay({Expenses,categories,profile}: {Expenses: TransactionType[],categories: CategoryType[],profile:ProfileType}) {
    const res = await serverFetch(`/api/budgets/${profile.id}/`,{next:{tags:['budgets']}});
    const budgetsData = await res.json();
    const budgets: BudgetType[] = budgetsData.results;
    return (
        <div className="col-span-6 row-start-2 row-end-6 flex flex-col gap-1">
            <h3 className="sm:text-lg text-sm">Categories breakdown</h3>
            <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2"> 
                    {
                        budgets.map((budget:BudgetType) => {
                            const totalExpenses = Expenses.filter((t: TransactionType) => t.category.id === budget.category.id).reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);
                            return (
                                <BudgetCard key={budget.id} budget={budget} totalExpenses={totalExpenses} categories={categories}/>
                            )
                        })
                    }
                    <AddBudget categories={categories}/>
                </div>
        </div>
    );
}