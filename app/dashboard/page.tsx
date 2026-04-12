import ThemeToggle from "@/components/app/theme-toggle";
import Incoms from "@/components/app/incoms";
import Expenses from "@/components/app/expenses";
import User from "@/components/app/user";   
import Savings from "@/components/app/savings";
import Transactions from "@/components/app/transactions";
import Balance from "@/components/app/balance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if(!token){
        redirect("/auth/signin");
    }
    return (
        <section className="w-screen h-screen flex flex-col">
            <div className="w-full h-12 px-4 flex items-center justify-between">
               <h1 className="text-2xl font-bold">Fin<span className="text-primary">Flow</span></h1>
               <div className="flex items-center gap-2">
                <User />
                <ThemeToggle /> 
               </div>
            </div>
            <div className="w-full flex-1 grid grid-cols-6 grid-rows-5 gap-3 p-4">
                <Balance/>
                <Incoms />
                <Expenses />
                <Savings />
                <Transactions />
            </div>
        </section>
    );
}