import ThemeToggle from "@/components/app/themeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import User from "@/components/app/user";   
export default function Dashboard() {
    return (
        <section className="w-screen h-screen flex flex-col">
            <div className="w-full h-12 px-4 flex items-center justify-between">
               <h1>APP NAME</h1>
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
                        <div className="size-52 rounded-full bg-amber-300 self-center"/>
                    </CardContent>
                </Card>
                <Card className="col-start-4 col-end-7 row-start-2 row-end-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex-col gap-1">
                        <h1 className="text-xl">Recent Activities</h1>
                        <div className="flex-1 flex-col">
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                            <p>transaction 1 </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button><Plus className="size-4"/> Add Transaction</Button>
                    </CardFooter>
                </Card>
            </div>
        </section>
    );
}