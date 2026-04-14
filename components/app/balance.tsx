"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useProfile } from "@/context/Profile";
import { Skeleton } from "../ui/skeleton";
import { format } from "@/lib/utils";

export default function Balance() {
    const {profile,loading} = useProfile();
    const balance = profile?.balance ?? 0.00;
    const formatedBalance = format.format(balance);
    return (
        <Card className="col-start-1 col-span-2 row-start-1 row-end-2 gap-1 py-1">
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="w-full h-5" /> : <p className="sm:text-xl text-lg">{formatedBalance}</p>}
                    </CardContent>
        </Card>
    );
}