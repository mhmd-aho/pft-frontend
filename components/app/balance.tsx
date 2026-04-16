import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { format } from "@/lib/utils";
import { getUser } from "@/lib/user";
export default async function Balance() {
    const auth = await getUser();
    if(!auth || !auth.profileData){
        return null;
    }
    const balance = auth.profileData.balance;
    const formatedBalance = format.format(balance);
    return (
        <Card className="col-start-1 col-span-2 row-start-1 row-end-2 max-sm:gap-1 max-sm:py-1">
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="sm:text-xl text-lg">{formatedBalance}</p>
                    </CardContent>
        </Card>
    );
}