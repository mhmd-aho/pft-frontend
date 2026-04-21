import BudgetHeader from "@/components/app/budget-header";
import BudgetsDisplay from "@/components/app/budgets-display";
import { getUser } from "@/lib/user";
import { serverFetch } from "@/lib/server-fetch";
import { TransactionType } from "@/lib/schemas";
export default async function Budget() {
      const profileData = await getUser();
  if (typeof profileData === 'string')  {
    return null;
  }

  const res = await serverFetch(`/api/transactions/profile/${profileData.id}/monthly/`, {
    next: { tags: ['transactions'] } 
  });
  const transactionsData = await res.json();
  const transactions:TransactionType[] = transactionsData.results;
  const categoriesRes = await serverFetch(`/api/categories/`,{
        next: { tags: ['categories'] } 
    });
  const categoriesResJson = await categoriesRes.json();
  const categories = categoriesResJson.results;
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