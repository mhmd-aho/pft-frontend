"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useProfile } from "@/context/Profile";
import {useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "@/lib/schemas";
import {z} from "zod";
import { useTransition } from "react";
type SignInFormType = z.infer<typeof signinSchema>
export function SignInForm() {
    const [isPending,startTransition] = useTransition()
    const {register,handleSubmit,formState:{ errors }}= useForm<SignInFormType>({
        resolver: zodResolver(signinSchema),
        defaultValues:{
            username: '',
            password: '',
        },
    })
    const router = useRouter();
    const {refreshProfile} = useProfile();
    const onSubmit = (data: SignInFormType ) => {
        startTransition(async ()=>{
            try{
                const response = await api.post("/auth/token/login/", {username: data.username, password: data.password});
                const token = response.data.auth_token;
                setCookie("token", token, {
                    maxAge: 60 * 60 * 24 * 7,
                    path: "/",
                });
                toast.success("Signed in successfully");
                await refreshProfile();
                router.push("/dashboard");
            }catch(error:unknown){
                const e = error as any;
                const  data = e?.response?.data 
                const backendMessage = data?.detail || data?.non_field_errors?.[0] || data?.username?.[0] || data?.password?.[0] || 'Invalid credentials';
                toast.error(backendMessage);
            }

        })
    }
    return(
        <Card className="sm:w-1/2 w-full sm:h-fit h-full">
                <CardHeader>
                    <CardTitle className="text-3xl">Sign In</CardTitle>
                    <CardDescription>
                        Enter your credentials to sign in to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="username" className="text-xl">Username</Label>
                            <Input className={`h-10 ${errors.username? 'border-destructive':''}`} id="username" type="text" {...register('username')}  />
                            {errors.username && <p className="text-xs text-destructive">{errors.username.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password" className="text-xl">Password</Label>
                            <Input className={`h-10 ${errors.password?'border-destructive':''}`} id="password" type="password" {...register('password')} />
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
                        </div>
                        <Button disabled={isPending} type="submit" className="w-full h-10 text-xl">Sign In</Button>  
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/auth/signup">Sign Up</Link>
                    </p>
                </CardFooter>
            </Card>
    )
}