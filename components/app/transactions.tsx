import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getUser } from "@/lib/user";
import { format } from "@/lib/utils";
export default async function Transactions({type}: {type: "expense" | "income"}) {
    const auth = await getUser();
    if(!auth || !auth.profileData){
        return null;
    }
    const res = await fetch(`http://127.0.0.1:8000/api/transactions/${auth.profileData.id}/monthly?type=${type}`, {
        headers: { Authorization: `Token ${auth.token}` },
        next: { revalidate: 60 } 
    });
    const data = await res.json();
    const transactions = Array.isArray(data) ? data : (data.results || []);
    const total = transactions.reduce((acc,transaction) => acc + Number(transaction.amount),0);
    const formattedTotal = format.format(total);
    const positions={
        income:"sm:col-start-3 sm:col-span-2 sm:row-start-1 row-start-2 col-start-1",
        expense:"sm:col-start-5 sm:col-span-2 sm:row-start-1 row-start-2 col-start-2"
    }
    return (
        <Card className={`${positions[type]} max-sm:gap-1 max-sm:py-1`}>
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">{type === "expense" ? "Expenses" : "Incomes"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="sm:text-xl text-lg">{formattedTotal}</p>
                    </CardContent>
        </Card>
    );
}