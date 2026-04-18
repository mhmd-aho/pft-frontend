import Transactions from "@/components/app/transactions";   
import Savings from "@/components/app/savings";
import LastActivies from "@/components/app/last-activities";
import Balance from "@/components/app/balance";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
export const metadata: Metadata = {
    title: "FinFlow | Dashboard",
    description: "Dashboard",
};
export default  function Dashboard() {
    return (
            <div className="w-full sm:h-[calc(100vh-3rem)] grid sm:grid-cols-6 sm:grid-rows-5  gap-3 sm:p-4 p-2  auto-rows-min">
                <Suspense fallback={<Skeleton className="col-start-1 col-span-2 row-start-1 row-end-2 max-sm:h-32" />}>
                    <Balance/>
                </Suspense>
                <Suspense fallback={<Skeleton className="sm:col-start-3 sm:col-span-2 sm:row-start-1 row-start-2 col-start-1 max-sm:h-32" />}>
                    <Transactions type="income" />
                </Suspense>
                <Suspense fallback={<Skeleton className="sm:col-start-5 sm:col-span-2 sm:row-start-1 row-start-2 col-start-2 max-sm:h-32" />}>
                    <Transactions type="expense" />
                </Suspense>
                <Suspense fallback={<Skeleton className="col-start-1 sm:col-end-4 sm:row-start-2 sm:row-end-6 row-start-3 row-end-8 max-sm:col-span-2 max-sm:h-[300px]" />}>
                    <Savings />
                </Suspense>
                <Suspense fallback={<Skeleton className="sm:col-start-4 col-start-1 sm:col-end-7 sm:row-start-2 sm:row-end-6 row-start-8 row-end-13 max-sm:col-span-2 max-sm:h-[300px]" />}>
                    <LastActivies/>
                </Suspense>
            </div>
    );
}