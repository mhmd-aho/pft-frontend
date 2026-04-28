'use client'
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { transactionSchema } from "@/lib/schemas";
import { z } from "zod";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { Label } from "../ui/label";
import { toast } from "sonner";
import AddCategory from "./add-category";
import { postTransaction } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";
type TransactionForm = z.infer<typeof transactionSchema>
export default function AddTransactions({categories,porfile_id}: {categories: {id: number, name: string}[], porfile_id: number}) {
    const [isPending,startTransition] = useTransition()
    const router = useRouter()
    const {register,reset,handleSubmit,formState:{errors}} = useForm<TransactionForm>({
        resolver: zodResolver(transactionSchema) as any,
        defaultValues:{
            category_id: 0,
            type:undefined as 'income' | 'expense' | undefined,
            amount: 0
        }
    })
    const onSubmit = (data: TransactionForm)=>{
        startTransition( async ()=>{
            if(!porfile_id){
                toast.error('You need to be logged in to add a transaction');
                return;
            }
            const res = await postTransaction(data, porfile_id)
            if(res && !res.success){
                toast.error(res.error)
            }else{
                toast.success('Transaction added successfully')
                reset()
                router.push('/dashboard')

            }

        })
    }

    return (
        <Card className="sm:w-1/2 w-full sm:h-fit h-full max-sm:rounded-none">
            <CardHeader>
                <CardTitle className="text-3xl">Add Transaction</CardTitle>
                <CardDescription>
                    Add a new transaction to your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xl" htmlFor="amount">Amount</Label>
                        <Input className={`h-10 ${errors.amount?'border-destructive':''}`} type='number' step='0.01' placeholder='0.00' {...register("amount",{valueAsNumber:true})} />
                        {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xl" htmlFor="type">Type</Label>
                        <NativeSelect className={`w-full ${errors.type?'border-destructive':''}`} {...register("type")}>
                            <NativeSelectOption value=''>Select Type</NativeSelectOption>
                            <NativeSelectOption value="income">Income</NativeSelectOption>
                            <NativeSelectOption value="expense">Expense</NativeSelectOption>
                        </NativeSelect>
                        {errors.type && <p className="text-destructive">{errors.type.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xl" htmlFor="category_id">Category</Label>
                        <NativeSelect className={`w-full ${errors.category_id?'border-destructive':''}`} {...register("category_id")}>
                            <NativeSelectOption value=''>Select Category</NativeSelectOption>
                            {categories.map((category) => (
                                <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                            ))}
                        </NativeSelect>
                        <AddCategory />
                        {errors.category_id && <p className="text-destructive">{errors.category_id.message}</p>}
                    </div>
                    <Button type="submit" className='h-10' disabled={isPending}>{isPending ? <><Loader2 className="size-4 animate-spin" /> Adding Transaction</>:<><Plus className="size-4" /> Add Transaction</>}</Button>
                </form>
            </CardContent>
        </Card>
    )
}