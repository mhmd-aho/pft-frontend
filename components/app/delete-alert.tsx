import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useTransition } from "react";
import { deleteTransaction, deleteBudget } from "@/app/actions";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import { Button } from "../ui/button";
export default function DeleteAlert({id,type}: {id: number,type: 'transaction' | 'budget'}) {
    const [isPending,startTransition] = useTransition();
    const handleDelete = () => {

        startTransition(async () => {
            const res = type === 'transaction'? await deleteTransaction(id) : await deleteBudget(id);
            if(res?.error){
                toast.error(res.error);
            }else{
                toast.success(`${type} deleted successfully`);
            }
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild disabled={isPending} className={type === 'transaction' ? "max-lg:w-full max-lg:h-full" : ""}>
                {
                    type === 'transaction'?
                        isPending ? <Loader2 className="size-4 animate-spin max-lg:hidden" /> : <Trash className="text-red-500 size-4 max-lg:hidden" />
                        :
                        isPending? <Button variant='destructive' size='lg'>deleting <Loader2 className="size-4 animation-spin"/></Button> : <Button variant='destructive' size='lg'>delete</Button>
                }
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this {type} and remove it from the server.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}