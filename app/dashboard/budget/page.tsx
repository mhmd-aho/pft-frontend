import BudgetHeader from "@/components/app/budget-header";
import BudgetsDisplay from "@/components/app/budgets-display";
import { getUser, getMonthlyTransactions } from "@/lib/caches";
import { TransactionType } from "@/lib/schemas";
import { serverFetch } from "@/lib/server-fetch";
export default async function Budget() {
      const profileData = await getUser();
  if (typeof profileData === 'string')  {
    return null;
  }
  const [transactions,categoriesRes] = await Promise.all([
    getMonthlyTransactions(profileData.id),
    serverFetch(`/api/categories/`,{
        next: { tags: ['categories'] } 
    })

  ])
  if(typeof transactions === 'string'){
    return null;
  }
  const categories = await categoriesRes.json();
  const Expenses = transactions.filter((t: TransactionType) => t.type === "expense")
  const Incomes = transactions.filter((t: TransactionType) => t.type === "income");
  const totalExpenses = Expenses.reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);
  const totalIncomes = Incomes.reduce((acc: number, t: TransactionType) => acc + Number(t.amount), 0);
    return (
        <div className="w-full sm:h-[calc(100vh-3rem)] grid sm:grid-cols-6 sm:grid-rows-5  gap-3 sm:p-4 p-2  auto-rows-min">
            <BudgetHeader totalExpenses={totalExpenses} totalIncomes={totalIncomes} />
            <BudgetsDisplay Expenses={Expenses} categories={categories}/>
        </div>
    );
}