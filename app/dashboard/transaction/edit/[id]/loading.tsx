import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="w-full h-[calc(100vh-4rem)] flex justify-center items-center">
            <Skeleton className="sm:w-1/2 w-full sm:h-fit h-full" />
        </div>
    );
}