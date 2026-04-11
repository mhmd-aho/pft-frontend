"use client"
import ThemeToggle from "@/components/app/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import User from "@/components/app/user";   
import { ChartPieDonutText } from "@/components/app/pie-chart";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { ProfileType, UserType } from "@/lib/schemas";
import Transactions from "@/components/app/transactions";
export default function Dashboard() {
    const [profile,setProfile] = useState<ProfileType | null>(null);
    const [user,setUser] = useState<UserType | null>(null);
    // useEffect(()=>{
    //     const fetchUser = async () => {
    //         try{
    //             const response = await api.get("/auth/users/me/");
    //             setUser(response.data);
    //         }catch(error){
    //             console.log(error);
    //         }
    //     }
    //     fetchUser();

    //     const fetchProfile = async(username: string) => {
    //         try{
    //             const response = await api.get(`/api/profiles/${username}/`);
    //             setProfile(response.data);
    //         }catch(error){
    //             console.log(error);
    //         }
    //     }
    //     if(user && !profile){
    //         fetchProfile(user.username);
    //     }
    // },[user,profile]);
    return (
        <section className="w-screen h-screen flex flex-col">
            <div className="w-full h-12 px-4 flex items-center justify-between">
               <h1 className="text-2xl font-bold">Fin<span className="text-primary">Flow</span></h1>
               <div className="flex items-center gap-2">
                <User />
                <ThemeToggle /> 
               </div>
            </div>
            <div className="w-full flex-1 grid grid-cols-6 grid-rows-5 gap-3 p-4">
                <Card className="col-start-1 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl">$0.00</h1>
                    </CardContent>
                </Card>
                <Card className="col-start-3 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Incomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl">$0.00</h1>
                    </CardContent>
                </Card>
                <Card className="col-start-5 col-span-2 row-start-1">
                    <CardHeader>
                        <CardTitle className="text-3xl">Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl">$0.00</h1>
                    </CardContent>
                </Card>
                <Card className="col-start-1 col-end-4 row-start-2 row-end-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartPieDonutText profile={profile} />
                    </CardContent>
                </Card>
                <Transactions profile={profile} />
            </div>
        </section>
    );
}