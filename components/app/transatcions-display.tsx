'use client'
import { TransactionType } from "@/lib/schemas";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useTransition } from "react";
import { Button } from "../ui/button";
import { Loader2, Trash } from "lucide-react";
import { deleteTransaction } from "@/app/actions";
import { toast } from "sonner";
export default function TransactionsDisplay({transactions,error}:{transactions:TransactionType[],error:string | null}) {
   const option:Intl.DateTimeFormatOptions = {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}
   const container = useRef(null);
   const [isPending, startTransition] = useTransition();
   useGSAP(() => {
    if(transactions.length === 0 || error){
        return;
    }
    gsap.from('.transation',{
        opacity: 0,
        y: -20,
        duration: 0.5,
        stagger: 0.1
    })
   }, {scope:container});
    return (
        <div ref={container} className="flex-1 min-h-0 flex flex-col gap-1 overflow-y-scroll">
                        {  error? 
                            <p className="text-lg mx-auto">{error}</p>
                            :
                            transactions.map((transaction) => (
                                <div key={transaction.id} className="transation flex items-center justify-between px-2 relative group">
                                    <Button className="absolute top-1/2 -translate-y-1/2 left-1/3 hidden group-hover:block" 
                                    variant='ghost' 
                                    size='icon'
                                    disabled={isPending}
                                    onClick={()=>{
                                        startTransition(async () => {
                                            const res = await deleteTransaction(transaction.id);
                                            if(res?.error){
                                                toast.error(res.error);
                                            }else{
                                                toast.success("Transaction deleted successfully");
                                            }
                                        });
                                    }}>
                                        {isPending ? <Loader2 className="size-4 animate-spin"/> : <Trash className="size-4"/>}
                                    </Button>
                                    <div>
                                        <p className="sm:text-lg text-md">{transaction.category.name}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString('en-US',option)}</p>
                                    </div>
                                    <p className={`sm:text-lg text-md ${transaction.type === "income" ? "text-success" : "text-destructive"}`}>{transaction.type === "income" ? "+" : "-"}{transaction.amount}</p>
                                </div>
                            ))

                        }
        </div>
    );
}