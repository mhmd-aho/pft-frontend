import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { postCategory } from "@/app/actions";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
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
            if(res && !res.success){
                toast.error(res.error)
            }else{
                toast.success('Category added successfully')
            }

        })
    }
    return (
        <Dialog>
            <DialogTrigger disabled={isPending} asChild>
                {isPending ? <Skeleton className="w-full h-10" /> : <Button variant="outline" size="sm" className="w-full"><Plus className="size-4"/> Add Category</Button>}
            </DialogTrigger>
            <DialogContent className="h-fit w-80">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                    <Input type='text' placeholder='Category Name' value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={() => handleAddCategory(name)}>Add Category</Button>
            </DialogContent>
        </Dialog>
    );
}