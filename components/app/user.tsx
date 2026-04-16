import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { getUser } from "@/lib/user";

export default async function User() {
    const auth = await getUser();
    if(!auth || !auth.profileData){
        return null;
    }
    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Button variant="ghost">{auth.profileData.user.username}</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-fit">
            <Button variant="ghost">Logout</Button>
            </HoverCardContent>
        </HoverCard>
    );
}