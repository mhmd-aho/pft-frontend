import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full sm:h-[calc(100vh-3rem)] grid sm:grid-cols-6 sm:grid-rows-5  gap-3 sm:p-4 p-2  auto-rows-min">
            <Skeleton className="col-start-1 col-span-6 row-start-1 h-32 w-full" />
            <div className="col-span-6 row-start-2 row-end-6 flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />           
                <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 overflow-y-auto gap-3 pb-2"> 
                    {Array.from({length: 6}).map((_,i) => {
                        return (
                            <Skeleton key={i} className="col-span-1 row-span-1 w-full h-32" />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}