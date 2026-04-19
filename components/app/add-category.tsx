import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { postCategory } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
export default function AddCategory() {
    const [name, setName] = useState('');
    const [isPending, startTransition] = useTransition();
    const handleAddCategory = (name: string)=>{
        if(!name){
            toast.error('Category name is required')
            return;
        }
        startTransition( async ()=>{
            const res = await postCategory(name)
            if(res?.error){
                toast.error(res.error)
            }else{
                toast.success('Category added successfully')
            }

        })
    }
    return (
        <Popover>
            <PopoverTrigger disabled={isPending} asChild>
                {isPending ? <Skeleton className="w-full h-10" /> : <Button variant="outline" size="sm" className="w-full"><Plus className="size-4"/> Add Category</Button>}
            </PopoverTrigger>
            <PopoverContent className="h-fit w-80">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="name">Category Name</Label>
                    <Input type='text' placeholder='Category Name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <Button onClick={() => handleAddCategory(name)}>Add Category</Button>
            </PopoverContent>
        </Popover>
    );
}