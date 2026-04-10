import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
export default function SignUp() {
    return (
        <section className="w-screen h-screen flex items-center justify-center">
            <Card className="w-1/2 h-fit">
                <CardHeader>
                    <CardTitle className="text-3xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your credentials to sign up for an account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-xl">Username</Label>
                        <Input className="h-10" id="name" type="text" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xl">Email</Label>
                        <Input className="h-10" id="email" type="email" placeholder="[EMAIL_ADDRESS]" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-xl">Password</Label>
                        <Input className="h-10" id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full h-10 text-xl">Sign Up</Button>
                </CardFooter>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/auth/signin">Sign In</Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
}