'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import { useState,useEffect } from "react";
import api from "@/lib/api";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
import { toast } from "sonner";
import type { ProfileType } from "@/lib/schemas";
export default function Transactions({profile}: {profile: ProfileType}) {
    const [categories,setCategories] = useState<{id: number, name: string}[]>([]);
    const [type,setType] = useState<string>("");
    const [category,setCategory] = useState<string>("");
    const [amount,setAmount] = useState<number>(0);
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try{
    //             const response = await api.get("/api/categories/");
    //             setCategories(response.data.results);
    //         }catch(error){
    //             console.log(error);
    //         }
    //     }
    //     fetchCategories();
    // }, []);
    const handleAddTransaction = () => {
        if(!type || !category || !amount){
            toast.error("Please fill all the fields");
            return;
        }
        try{
            api.post("/api/transactions/",{
                type: type,
                category_id:category,
                amount:amount,
                profile_id:profile.id,

            });
            toast.success("Transaction added successfully");
        }catch(error){
            console.log(error);
            toast.error('Failed to add transaction');
        }
    }
    return (
    <Card className="col-start-4 col-end-7 row-start-2 row-end-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex-col gap-1">
                        <h1 className="text-xl">Recent Activities</h1>
                        <div className="flex-1 flex-col">
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button><Plus className="size-4"/> Add Transaction</Button>
                            </PopoverTrigger>
                            <PopoverContent className="h-fit">
                                    <Input type="number" placeholder="Amount" onChange={(e) => setAmount(Number(e.target.value))} />
                                    <NativeSelect className="w-full" onChange={(e) => setType(e.target.value)}>
                                        <NativeSelectOption>Select Type</NativeSelectOption>
                                        <NativeSelectOption value="income">Income</NativeSelectOption>
                                        <NativeSelectOption value="expense">Expense</NativeSelectOption>
                                    </NativeSelect>
                                    <NativeSelect className="w-full" onChange={(e) => setCategory(e.target.value)}>
                                        <NativeSelectOption>Select Category</NativeSelectOption>
                                        {categories.map((category) => (
                                            <NativeSelectOption key={category.id} value={category.id}>{category.name}</NativeSelectOption>
                                        ))}
                                    </NativeSelect>
                                    <Button onClick={handleAddTransaction}>Add Transaction</Button>
                            </PopoverContent>
                        </Popover>
                    </CardFooter>
        </Card>
    );
}