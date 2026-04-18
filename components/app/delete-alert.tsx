import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useTransition } from "react";
import { deleteTransaction } from "@/app/actions";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
export default function DeleteAlert({id}: {id: number}) {
    const [isPending,startTransition] = useTransition();
    const handleDelete = () => {

        startTransition(async () => {
            const res = await deleteTransaction(id);
            if(res?.error){
                toast.error(res.error);
            }else{
                toast.success("Transaction deleted successfully");
            }
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger disabled={isPending} className="max-lg:w-full max-lg:h-full">
                {isPending ? <Loader2 className="size-4 animate-spin max-lg:hidden" /> : <Trash className="text-red-500 size-4 max-lg:hidden" />}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this transaction and remove it from the server.
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