'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { registerSchema } from "@/lib/schemas"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z} from "zod";
import { useRouter } from "next/navigation";
import { useProfile } from "@/context/Profile";
import api from "@/lib/api";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
type signup = z.infer<typeof registerSchema>
export default function SignUp() {
  const {register,handleSubmit,formState:{ errors }}= useForm<signup>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
            username: '',
            email:'',
            password: '',
            re_password:''
        },
    })
    const router = useRouter();
    const {refreshProfile} = useProfile();
    const onSubmit = async (data: signup ) => {
        try{
            const response = await api.post("/auth/users/", {username: data.username,email: data.email ,password: data.password,re_password: data.re_password});
            if(response.status == 201){
                const getToken = await api.post('/auth/token/login/',{username: data.username, password: data.password})
                const token =  getToken.data.auth_token 
                setCookie("token", token, {
                    maxAge: 60 * 60 * 24 * 7,
                    path: "/",
                });
                toast.success('Sign up successfully')
                await refreshProfile()
                router.push('/dashboard')
            }
        }catch(error){
            const backendMessage = error.response?.data?.detail || error.response?.data?.username?.[0] || error.response?.data?.email?.[0] || error.response?.data?.password?.[0] || error.response?.data?.re_password?.[0] || 'Registration failed';
            toast.error(backendMessage);
        }
    }
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
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="username" className="text-xl">Username</Label>
                            <Input className={`h-10 ${errors.username? 'border-destructive':''}`} id="username" type="text" {...register('username')}  />
                            {errors.username && <p className="text-xs text-destructive">{errors.username.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="email" className="text-xl">Email</Label>
                            <Input className={`h-10 ${errors.email? 'border-destructive':''}`} id="email" type="text" {...register('email')}  />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password" className="text-xl">Password</Label>
                            <Input className={`h-10 ${errors.password?'border-destructive':''}`} id="password" type="password" {...register('password')} />
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="re_password" className="text-xl">Confirm password</Label>
                            <Input className={`h-10 ${errors.re_password?'border-destructive':''}`} id="re_password" type="password" {...register('re_password')} />
                            {errors.re_password && <p className="text-xs text-destructive">{errors.re_password.message as string}</p>}
                        </div>
                        <Button type="submit" className="w-full h-10 text-xl">Sign Up</Button>  
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/auth/signin">Sign In</Link>
                    </p>
                </CardFooter>
            </Card>
        </section>
    );
}