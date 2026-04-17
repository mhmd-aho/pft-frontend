import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
        </div>
    );
}