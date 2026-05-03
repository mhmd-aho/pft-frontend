import { Card, CardHeader, CardTitle } from "../ui/card";
import { getUser, getMonthlyTransactions } from "@/lib/caches";
import { TransactionType } from "@/lib/schemas";
import FormattedTotal from "./formatted-total";
export default async function Transactions({type}: {type: "expense" | "income"}) {
    const profileData = await getUser();
    if(typeof profileData === 'string'){
        return null;
    }
    const transactions = await getMonthlyTransactions(profileData.id);
    if(typeof transactions === 'string'){
        return null;
    }
    const total = transactions.filter((t:TransactionType) => t.type === type).reduce((acc:number,transaction:TransactionType) => acc + Number(transaction.amount),0);
    const positions={
        income:"sm:col-start-3 sm:col-span-2 sm:row-start-1 row-start-2 col-start-1",
        expense:"sm:col-start-5 sm:col-span-2 sm:row-start-1 row-start-2 col-start-2"
    }
    return (
        <Card className={`${positions[type]} max-sm:gap-1 max-sm:py-1`}>
                    <CardHeader>
                        <CardTitle className="sm:text-3xl text-xl">{type === "expense" ? "Expenses" : "Incomes"}</CardTitle>
                    </CardHeader>
                    <FormattedTotal total={total} />
        </Card>
    );
}