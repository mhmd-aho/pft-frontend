import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useTransition } from "react";
import { deleteTransaction, deleteBudget } from "@/app/actions";
import { toast } from "sonner";
import { Loader2} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
export default function DeleteAlert({id,type}: {id: number,type: 'transaction' | 'budget'}) {
    const [isPending,startTransition] = useTransition();
    const router = useRouter();
    const handleDelete = () => {

        startTransition(async () => {
            const res = type === 'transaction'? await deleteTransaction(id) : await deleteBudget(id);
            if(res && !res.success){
                toast.error(res.error);
            }else{
                toast.success(`${type} deleted successfully`);
                if(type === 'transaction'){
                    router.push('/dashboard');
                }
            }
        });
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild disabled={isPending} className={type === 'transaction' ? "max-lg:w-full max-lg:h-full" : ""}>
                {isPending?
                    <Button size='lg' disabled={isPending}>
                        deleting
                        <Loader2 className="size-4 animate-spin" />
                    </Button>
                    :
                    <Button size='lg' variant='destructive'>delete</Button>
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