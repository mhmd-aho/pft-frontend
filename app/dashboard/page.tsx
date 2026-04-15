import ThemeToggle from "@/components/app/theme-toggle";
import Transactions from "@/components/app/transactions";
import User from "@/components/app/user";   
import {ChartPieDonutText} from "@/components/app/pie-chart";
import LastActivies from "@/components/app/last-activities";
import Balance from "@/components/app/balance";
import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
    title: "FinFlow | Dashboard",
    description: "Dashboard",
};
export default function Dashboard() {
    return (
        <section className="w-screen h-screen flex flex-col">
            <div className="w-full h-12 px-4 flex items-center justify-between">
               <span className="text-2xl font-bold">Fin<span className="text-primary">Flow</span></span>
               <div className="flex items-center gap-2">
                <User />
                <ThemeToggle /> 
               </div>
            </div>
            <div className="w-full sm:h-[calc(100vh-3rem)] grid sm:grid-cols-6 sm:grid-rows-5  gap-3 sm:p-4 p-2  auto-rows-min">
                <Suspense fallback={<div>Loading...</div>}>
                    <Balance/>
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                    <Transactions type="income" />
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                    <Transactions type="expense" />
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                    <ChartPieDonutText />
                </Suspense>
                <Suspense fallback={<div>Loading...</div>}>
                    <LastActivies />
                </Suspense>
            </div>
        </section>
    );
}