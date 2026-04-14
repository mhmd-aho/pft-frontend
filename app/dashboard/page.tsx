import ThemeToggle from "@/components/app/theme-toggle";
import Transactions from "@/components/app/transactions";
import User from "@/components/app/user";   
import {ChartPieDonutText} from "@/components/app/pie-chart";
import LastActivies from "@/components/app/last-activities";
import Balance from "@/components/app/balance";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "FinFlow | Dashboard",
    description: "Dashboard",
};
export default async function Dashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if(!token){
        redirect("/auth/signin");
    }
    try{
        await fetch("http://localhost:3000/auth/users/me",{
            headers:{
                "Authorization": `Token ${token}`
            },
            cache:"no-store"
        })
    }catch{
        redirect("/auth/signin");
    }
    return (
        <section className="w-screen h-screen flex flex-col">
            <div className="w-full h-12 px-4 flex items-center justify-between">
               <span className="text-2xl font-bold">Fin<span className="text-primary">Flow</span></span>
               <div className="flex items-center gap-2">
                <User />
                <ThemeToggle /> 
               </div>
            </div>
            <div className="w-full sm:h-[calc(100vh-3rem)] h-[150%] grid grid-cols-2 sm:grid-cols-6 sm:grid-rows-5 grid-rows-12 gap-3 p-4">
                <Balance/>
                <Transactions type="income" />
                <Transactions type="expense" />
                <ChartPieDonutText />
                <LastActivies />
            </div>
        </section>
    );
}