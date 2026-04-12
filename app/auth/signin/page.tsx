"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useProfile } from "@/context/Profile";
export default function SignIn() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {refreshProfile} = useProfile();
    const handleSignIn = async () => {
        try{
            const response = await api.post("/auth/token/login/", {username: username, password: password});
            const token = response.data.auth_token;
            setCookie("token", token, {
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });
            toast.success("Signed in successfully");
            await refreshProfile();
            router.push("/dashboard");
        }catch(error){
            console.log(error);
            toast.error('Invalid credentials');
        }
    }
    return (
        <section className="w-screen h-screen flex items-center justify-center">
            <Card className="w-1/2 h-fit">
                <CardHeader>
                    <CardTitle className="text-3xl">Sign In</CardTitle>
                    <CardDescription>
                        Enter your credentials to sign in to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-xl">Username or Email</Label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} className="h-10" id="email" type="text" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-xl">Password</Label>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} className="h-10" id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSignIn} className="w-full h-10 text-xl">Sign In</Button>
                </CardFooter>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/auth/signup">Sign Up</Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
}