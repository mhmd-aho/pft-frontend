import { Card, CardHeader, CardTitle } from "../ui/card";
import { getUser } from "@/lib/user";
import FormattedTotal from "./fornatted-total";
export default async function Balance() {
    const profileData = await getUser();
    if(typeof profileData === 'string'){
        return null;
    }
    const balance = profileData.balance;
    return (
        <Card className="col-start-1 col-span-2 row-start-1 row-end-2 max-sm:gap-1 max-sm:py-1">
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">Balance</CardTitle>
                    </CardHeader>
                    <FormattedTotal total={balance} />
        </Card>
    );
}