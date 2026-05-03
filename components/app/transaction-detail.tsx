'use client'
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { TransactionType } from "@/lib/schemas";
import DeleteAlert from "./delete-alert";
import { useState } from "react";
import { patchTransaction } from "@/app/actions";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { CategoryType } from "@/lib/schemas";
type TransactionSchemaType = {
    amount: number;
    type: string;
    category_id: number;
    profile_id: string;
}
export default function TransactionDetail({transaction,categories,profileId}:{transaction:TransactionType,categories:CategoryType[],profileId:string}) {
    const [isEditing, setIsEditing] = useState(false);
    const [data,setData] = useState<TransactionSchemaType>({amount:transaction.amount,type:transaction.type,category_id:transaction.category.id,profile_id:profileId});
    const handleEdit = async () => {
        if(data.amount === transaction.amount && data.type === transaction.type && data.category_id === transaction.category.id){
            setIsEditing(false);
            return;
        }
        const res = await patchTransaction(data,transaction.id);
        if(res.success){
            toast.success('Transaction updated successfully');
        }else{
            toast.error(res.error);
        }
        setIsEditing(false);
    }
    const option:Intl.DateTimeFormatOptions = {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}
    return (
        <Card className="sm:w-1/2 w-full sm:h-fit h-full max-sm:rounded-none">
            <CardHeader>
                <CardTitle className="text-3xl">Transaction Detail</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <p className="text-xl">Amount</p>
                        {isEditing? <Input type="number" className="w-32" value={data.amount} onChange={(e)=>setData({...data,amount:Number(e.target.value)})} />: <p className="text-lg">{transaction.amount}</p>}
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xl">Type</p>
                        {isEditing? 
                        <NativeSelect className="w-32" value={data.type} onChange={(e)=>setData({...data,type:e.target.value})}>
                            <NativeSelectOption value={transaction.type}>{transaction.type}</NativeSelectOption>
                            <NativeSelectOption value={transaction.type === 'income'? 'expense' : 'income'}>{transaction.type === 'income'? 'Expense' : 'Income'}</NativeSelectOption>
                        </NativeSelect>
                        : 
                        <p className="text-lg">{transaction.type}</p>}
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xl">Category</p>
                        {isEditing? 
                        <NativeSelect className="w-32" value={data.category_id} onChange={(e)=>setData({...data,category_id:Number(e.target.value)})}>
                            <NativeSelectOption value={transaction.category.id}>{transaction.category.name}</NativeSelectOption>
                            {categories.map((category) => {
                                if(category.id === transaction.category.id) return null;
                                return <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                            })}
                        </NativeSelect>
                        : 
                        <p className="text-lg">{transaction.category.name}</p>}
                    </div>
                    <div className="flex justify-between">
                        <p className="text-xl">Date</p>
                        <p className="text-lg">{new Date(transaction.created_at).toLocaleDateString('en-US',option)}</p>
                    </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button onClick={() => isEditing? handleEdit(): setIsEditing(true)} size='lg' variant='outline'>{isEditing? 'Save': 'Edit'}</Button>
                <DeleteAlert type="transaction" id={transaction.id} />
            </CardFooter>
        </Card>
    );
}