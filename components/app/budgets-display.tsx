import { TransactionType,CategoryType,BudgetType } from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
import { BudgetCard } from "./budget-card";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function BudgetsDisplay({Expenses,categories}: {Expenses: TransactionType[],categories: CategoryType[]}) {
    const res = await serverFetch(`/api/budgets/`,{next:{tags:['budgets']}});
    const budgetsData = await res.json();
    const budgets: BudgetType[] = budgetsData;
    return (
        <div className="col-span-6 row-start-2 row-end-6 flex flex-col gap-1">
            <h3 className="sm:text-lg text-sm">Budgets breakdown</h3>
            <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 overflow-y-auto gap-3 pb-2"> 
                    {
                        budgets.map((budget:BudgetType) => {
                            const totalExpenses = Expenses.filter((t: TransactionType) => t.category.id === budget.category.id).reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);
                            return (
                                <BudgetCard key={budget.id} budget={budget} totalExpenses={totalExpenses} categories={categories}/>
                            )
                        })
                    }
                    <Link href="/dashboard/budgets/add" className="sm:min-h-48 lg:h-72 h-32 flex flex-col items-center justify-center border-muted shadow border  rounded-md cursor-pointer">
                                <Plus className="sm:size-20 size-10"/>
                                <p className="sm:text-lg text-sm">Add Budget</p>
                    </Link>
            </div>
        </div>
    );
}