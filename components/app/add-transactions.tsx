'use client'
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { transactionSchema } from "@/lib/schemas";
import { z } from "zod";
import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { Label } from "../ui/label";
import { toast } from "sonner";
import AddCategory from "./add-category";
import { postTransaction } from "@/app/actions";
type TransactionForm = z.infer<typeof transactionSchema>
export default function AddTransactions({categories,porfile_id}: {categories: {id: number, name: string}[], porfile_id: number}) {
    const [isPending,startTransition] = useTransition()
    const {register,handleSubmit,formState:{errors}} = useForm<TransactionForm>({
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
            }

        })
    }

    return (
            <Popover>
                <PopoverTrigger className="cursor-pointer" asChild>
                        <Button className="max-sm:w-full"><Plus className="size-4"/> Add Transaction</Button>
                </PopoverTrigger>
                <PopoverContent className="h-fit w-80">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="amount">Amount</Label>
                            <Input type='number' step='0.01' placeholder='0.00' {...register("amount",{valueAsNumber:true})} />
                            {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="type">Type</Label>
                            <NativeSelect className="w-full" {...register("type")}>
                                <NativeSelectOption value=''>Select Type</NativeSelectOption>
                                <NativeSelectOption value="income">Income</NativeSelectOption>
                                <NativeSelectOption value="expense">Expense</NativeSelectOption>
                            </NativeSelect>
                            {errors.type && <p className="text-destructive">{errors.type.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="category_id">Category</Label>
                            <NativeSelect className="w-full" {...register("category_id")}>
                                <NativeSelectOption value=''>Select Category</NativeSelectOption>
                                {categories.map((category) => (
                                    <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                                ))}
                            </NativeSelect>
                            <AddCategory />
                            {errors.category_id && <p className="text-destructive">{errors.category_id.message}</p>}
                        </div>
                        <Button type="submit" disabled={isPending}>{isPending ? <>Adding Transaction <Loader2 className="size-4 animate-spin ml-2" /></>:'Add Transaction'}</Button>
                    </form>
                </PopoverContent>
            </Popover>
    )
}