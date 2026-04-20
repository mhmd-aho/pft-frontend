'use client'
import { BudgetType, CategoryType } from "@/lib/schemas";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { format } from "@/lib/utils";
import { useState } from "react";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { patchBudget } from "@/app/actions";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import DeleteAlert from "./delete-alert";
export function BudgetCard({budget,totalExpenses,categories}: {budget: BudgetType,totalExpenses: number,categories: CategoryType[]}) {
    const [isEditing,setIsEditing] = useState(false);
    const formattedTotalExpenses = format.format(totalExpenses);
    const formattedBudgetAmount = format.format(budget.amount);
    const progress = (totalExpenses/budget.amount)*100;
    const [data,setData] = useState({
        category_id: budget.category.id,
        amount: budget.amount
    })
    const handleEdit = async () => {
        if(data.category_id === budget.category.id || data.amount === budget.amount){
            setIsEditing(false)
            return
        }
            const res = await patchBudget(data,budget.id);
            if(res?.error){
                toast.error(res.error)
            }
            else{
                toast.success('Budget updated successfully');
                setIsEditing(false);
            }
    }
    return (
        <Card key={budget.id} className="col-span-1 row-span-1">
                        <CardHeader>
                            {isEditing? (
                                <NativeSelect onChange={(e) => setData({...data,category_id: Number(e.target.value)})}>
                                    <NativeSelectOption value={budget.category.id}>{budget.category.name}</NativeSelectOption>
                                    {categories.map((category: CategoryType) => (
                                        <NativeSelectOption key={category.id} value={category.id}>
                                            {category.name}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                            ) : (
                                <CardTitle className="text-lg">{budget.category.name}</CardTitle>
                            )}
                        </CardHeader>
                        <CardContent>
                            <Field>
                                <FieldLabel>

                                    <p>{formattedTotalExpenses} / {isEditing? <Input type='number' step='0.01' placeholder='0.00' value={data.amount} onChange={(e) => setData({...data,amount: Number(e.target.value)})} className="w-32" /> : formattedBudgetAmount}</p>
                                </FieldLabel>
                                <Progress  value={progress} />
                            </Field>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button size='lg' onClick={isEditing? handleEdit : ()=>(setIsEditing(true))} variant="outline">{isEditing? 'Save' : 'Edit'}</Button>
                            <DeleteAlert id={budget.id} type='budget' />
                        </CardFooter>
        </Card>
    )
}


