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
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { signupAction } from "@/app/actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
type SignUpFormType = z.infer<typeof registerSchema>
export function SignUpForm(){
    const [inputTypeOne,setInputTypeOne]=useState<'password' | 'text'>('password');
    const [inputTypeTwo,setInputTypeTwo]=useState<'password' | 'text'>('password');
    const [isPending,startTransition] = useTransition()
    const {register,handleSubmit,formState:{ errors }}= useForm<SignUpFormType>({
        resolver: zodResolver(registerSchema),
        defaultValues:{
            username: '',
            email:'',
            password: '',
            re_password:''
        },
    })
    const router = useRouter();
    const onSubmit = (data: SignUpFormType ) => {
       startTransition(async()=>{
           try{
               const res = await signupAction(data);
               if(res.success){
                   toast.success("Signed up successfully");
                   router.push("/dashboard");
               }else{
                   toast.error(res.error);
               }
           }catch{
               toast.error("Something went wrong");
           }

       })
    }
    return (
            <Card className="sm:w-1/2 w-full sm:h-fit h-full">
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
                            <Input className={`h-10 ${errors.email? 'border-destructive':''}`} id="email" type="email" {...register('email')}  />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="password" className="text-xl">Password</Label>
                            <div className="relative">
                                <Input className={`h-10 ${errors.password?'border-destructive':''}`} id="password" type={inputTypeOne} {...register('password')} />
                                <Button type="button" variant="ghost" className="absolute right-2 top-0 h-full"  onClick={() => setInputTypeOne(inputTypeOne === 'password' ? 'text' : 'password')}>
                                    {inputTypeOne === 'password' ? <Eye /> : <EyeOff />}
                                </Button>
                            </div>

                            {errors.password && <p className="text-xs text-destructive">{errors.password.message as string}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="re_password" className="text-xl">Confirm password</Label>
                            <div className="relative">
                                <Input className={`h-10 ${errors.re_password?'border-destructive':''}`} id="re_password" type={inputTypeTwo} {...register('re_password')} />
                                <Button type="button" variant="ghost" className="absolute right-2 top-0 h-full"  onClick={() => setInputTypeTwo(inputTypeTwo === 'password' ? 'text' : 'password')}>
                                    {inputTypeTwo === 'password' ? <Eye /> : <EyeOff />}
                                </Button>
                            </div>
                            {errors.re_password && <p className="text-xs text-destructive">{errors.re_password.message as string}</p>}
                        </div>
                        <Button disabled={isPending} type="submit" className="w-full h-10 text-xl">{isPending ? <>Signing Up <Loader2 className="size-4 animate-spin ml-2" /></>:'Sign Up'}</Button>  
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account? <Link href="/auth/signin">Sign In</Link>
                    </p>
                </CardFooter>
            </Card>
    );
}