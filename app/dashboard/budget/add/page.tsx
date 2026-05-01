import { serverFetch } from "@/lib/server-fetch";
import AddBudget from "@/components/app/add-budget";
export default async function AddBudgetPage() {
      const categoriesRes = await serverFetch(`/api/categories/`,{
            next: { tags: ['categories'] } 
        });
      const categoriesResJson = await categoriesRes.json();
      const categories = categoriesResJson;
    return (
        <div className="w-full h-[calc(100vh-3rem)] flex items-center justify-center">
            <AddBudget categories={categories}/>
        </div>
    );
}