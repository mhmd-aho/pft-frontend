'use client'
import { getUserLastActivites, postUserTransaction, getCategories } from "@/app/actions";
import { useProfile } from "@/context/Profile";
import { useState, useEffect, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { transactionSchema } from "@/lib/schemas";
import { z } from "zod";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
type TransactionForm = z.infer<typeof transactionSchema>
export default function AddTransactions() {
    const {profile,loading} = useProfile();
    const [isPending,startTransition] = useTransition()
    const [categories,setCategories] = useState<{id: number, name: string}[]>([]);
    const [categoriesLoading,setCategoriesLoading] = useState(true);
    const {register,handleSubmit,formState:{errors}} = useForm<TransactionForm>({
        resolver: zodResolver(transactionSchema) as any,
        defaultValues:{
            category_id: 0,
            type:undefined as any,
            amount: 0
        }
    })
    useEffect(() => {
    const fetchCategories = async () => {
        const response = await getCategories();
        if(response.success){
            setCategories(response.data);
            setCategoriesLoading(false);
        }
    }
    fetchCategories();
   },[]);
    const onSubmit = (data: TransactionForm)=>{
        startTransition( async()=>{
            if(!profile){
                toast.error('You need to be logged in to add a transaction');
                return;
            }
            const response = await postUserTransaction({
                category_id: data.category_id,
                type: data.type,
                amount: data.amount,
                profile_id:profile.id})
            if(response.success){
                toast.success('Transaction added successfully')
                const update = await getUserLastActivites(profile.id);
                if(update.success){
                   
                }
            }else{
                toast.error(response.error)
            }

        })
    }
    return (
            <Popover>
                <PopoverTrigger disabled={categoriesLoading} asChild>
                    {
                        loading?
                        <Skeleton className="w-full h-10" />
                        :
                        <Button className="max-sm:w-full"><Plus className="size-4"/> Add Transaction</Button>
                    }
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
                            {errors.category_id && <p className="text-destructive">{errors.category_id.message}</p>}
                        </div>
                        <Button disabled={isPending}  type="submit">Add Transaction</Button>
                    </form>
                </PopoverContent>
            </Popover>
    );
}