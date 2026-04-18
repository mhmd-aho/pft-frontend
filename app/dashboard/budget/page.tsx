import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";

export default function Budget() {
    return (
        <div className="w-full sm:h-[calc(100vh-3rem)] grid sm:grid-cols-6 sm:grid-rows-5  gap-3 sm:p-4 p-2  auto-rows-min">
            <Card className="col-start-1 col-span-6 row-start-1 bg-primary/20">
                <CardContent className="flex justify-around items-center">
                    <div>
                        <h1 className="sm:text-3xl text-xl">Total Income</h1>
                        <h3 className="sm:text-lg text-sm">Total Income</h3>
                    </div>
                    <div>
                        <h1 className="sm:text-3xl text-xl">Total Expenses</h1>
                        <h3 className="sm:text-lg text-sm">Total Expenses</h3>
                    </div>
                    <div>
                        <h1 className="sm:text-3xl text-xl">Total Savings</h1>
                        <h3 className="sm:text-lg text-sm">Total Savings</h3>
                    </div>
                </CardContent>
            </Card>
            <div className="col-span-6 row-start-2 row-end-6 flex flex-col gap-1">
                <h3 className="sm:text-lg text-sm">Categories breakdown</h3>
                <div className="flex-1 grid grid-cols-3 grid-rows-3 gap-2">
                    <Card className="col-start-1 row-start-1">
                        <CardHeader>
                            <CardTitle>Rent</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                           <Field>
                                <FieldLabel>
                                    <p>500$ of 1000$ budget</p>
                                </FieldLabel>
                                <Progress value={50} />
                            </Field>
                            <Button variant='outline' className="w-full">Edit Budget</Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}