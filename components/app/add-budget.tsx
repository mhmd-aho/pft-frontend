'use client'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { budgetSchema, CategoryType } from "@/lib/schemas";
import {z} from 'zod'
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { postBudget, getProfile } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import AddCategory from "./add-category";
type BudgetForm = z.infer<typeof budgetSchema>;
export default function AddBudget({categories}: {categories: CategoryType[]}) {
    const [profile,setProfile] = useState<{id: number, name: string} | null>(null);
    const [profilePending,startProfileTransition] = useTransition();
    const [isPending,startTransition] = useTransition();
     const {register,handleSubmit,formState:{errors}} = useForm<BudgetForm>({
            resolver: zodResolver(budgetSchema) as any,
            defaultValues:{
                category_id: 0,
                amount: 0
            }
        })
    useEffect(()=>{
        const fetchData = async () => {
            startProfileTransition(async () => {
                const profileRes = await getProfile();
                if(profileRes.success){
                    setProfile(profileRes.data);
                }
                else{
                toast.error(profileRes.error)
            }
            })
        }
        fetchData();
    },[])
    if(!profile){
        return null;
    }
    const onSubmit = (data: BudgetForm) => {
        startTransition(async () => {
            const res = await postBudget(data,profile.id);
            if(res.success){
                toast.success('Budget added successfully');
            }
            else{
                toast.error(res.error)
            }
        })
    }
    return (
        <Popover>
            <PopoverTrigger disabled={profilePending} className="col-span-1 row-span-1 h-full flex flex-col items-center justify-center">
                {
                    profilePending?
                    <Skeleton className="col-span-1 row-span-1 h-full w-full" />
                    :
                    <>
                        <Plus className="sm:size-20 size-10"/>
                        <p className="sm:text-lg text-sm">Add Budget</p>
                    </>
                }
            </PopoverTrigger>
            <PopoverContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="amount">Amount</Label>
                            <Input type='number' step='0.01' placeholder='0.00' {...register("amount",{valueAsNumber:true})} />
                            {errors.amount && <p className="text-destructive">{errors.amount.message}</p>}
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
                        <AddCategory />
                        <Button type="submit" disabled={isPending}>Add Budget</Button>
                    </form>
                </PopoverContent>
        </Popover>

    )
}