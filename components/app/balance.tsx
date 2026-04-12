"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useProfile } from "@/context/Profile";
import { Skeleton } from "../ui/skeleton";

export default function Balance() {
    const {profile,loading} = useProfile();
    if(loading){
        return(
            <Card className="col-start-1 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-32 h-5" />
                    </CardContent>
            </Card>
        )
    }
    let balance = profile?.balance;
    if(!profile){
        balance = 0.00;
    }
    return (
        <Card className="col-start-1 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl">{balance} $</h1>
                    </CardContent>
        </Card>
    );
}