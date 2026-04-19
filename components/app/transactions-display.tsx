'use client'
import { TransactionType } from "@/lib/schemas";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DeleteAlert from "./delete-alert";
import { useRef } from "react";
export default function TransactionsDisplay({transactions,error,profileId}:{transactions:TransactionType[],error:string | null,profileId:number}) {
   const option:Intl.DateTimeFormatOptions = {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}
   const container = useRef(null);
   useGSAP(() => {
    if(transactions.length === 0 || error){
        return;
    }
    gsap.from('.transaction',{
        opacity: 0,
        y: -20,
        duration: 0.5,
        stagger: 0.1
    })
   }, {scope:container,dependencies:[transactions]});
    return (
        <div ref={container} className="flex-1 min-h-0 flex flex-col gap-1 overflow-y-scroll">
                        {  error? 
                            <p className="text-lg mx-auto">{error}</p>
                            :
                            transactions.map((transaction) => (
                                <div key={transaction.id} className="transaction flex items-center justify-between px-2 relative group hover:bg-accent transition-colors duration-300 pl-5">
                                    <div  className="absolute inset-0 max-lg:w-full max-lg:h-full lg:top-1/2 lg:-translate-y-1/2 lg:left-2  lg:opacity-0 lg:group-hover:opacity-100 max-lg:active:bg-white/10 transition-all duration-300" >
                                        <DeleteAlert id={transaction.id} transactionProfileId={transaction.profile.id} profileId={profile.id} type="transaction" />
                                    </div>
                                    <div  className="group-hover:pl-5 transition-all duration-300" >
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