'use client'

import { Button } from "../ui/button";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, CategoryType } from "@/lib/schemas";
import {z} from 'zod'
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { useTransition } from "react";
import { toast } from "sonner";
import { postBudget } from "@/app/actions";
import AddCategory from "./add-category";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter } from "next/navigation";
type BudgetForm = z.infer<typeof budgetSchema>;
export default function AddBudget({categories}: {categories: CategoryType[]}) {
    const [isPending,startTransition] = useTransition();
    const router = useRouter();
     const {register,handleSubmit,formState:{errors}} = useForm<BudgetForm>({
            resolver: zodResolver(budgetSchema) as any,
            defaultValues:{
                category_id: 0,
                amount: 0
            }
        })
    const onSubmit = (data: BudgetForm) => {
        startTransition(async () => {
            const res = await postBudget(data);
            if(res.success){
                toast.success('Budget added successfully');
                router.push('/dashboard/budget');
            }
            else{
                toast.error(res.error)
            }
        })
    }
    return (
        <Card className="sm:w-1/2 w-full sm:h-fit h-full max-sm:rounded-none">
            <CardHeader>
                <CardTitle className="text-3xl">Add Budget</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <Label className="text-xl" htmlFor="amount">Amount</Label>
                        <Input className={`h-10 ${errors.amount && 'ring-destructive ring-offset-destructive/20 ring-1'}`} type='number' step='0.01' placeholder='0.00' {...register("amount",{valueAsNumber:true})} />
                        {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label className="text-xl" htmlFor="category_id">Category</Label>
                        <NativeSelect className={`w-full ${errors.category_id && 'ring-destructive ring-offset-destructive/20 ring-1'}`} {...register("category_id")}>
                            <NativeSelectOption value=''>Select Category</NativeSelectOption>
                            {categories.map((category) => (
                                <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                            ))}
                        </NativeSelect>
                        {errors.category_id && <p className="text-destructive">{errors.category_id.message}</p>}
                            </div>
                            <AddCategory />
                            <Button className="h-10" type="submit" disabled={isPending}>{isPending ? <>Adding Budget <Loader2 className="size-4 animate-spin" /></>:<>Add Budget <Plus className="size-4" /></>}</Button>
                        </form>

            </CardContent>

        </Card>

    )
}