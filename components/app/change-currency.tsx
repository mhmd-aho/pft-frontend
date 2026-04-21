"use client"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { DollarSign } from "lucide-react";
import { supportedCurrencies } from "@/lib/utils";
export default function ChangeCurrency() {
    const handleCurrencyChange = (currency: string) => {
        localStorage.setItem("app_currency", currency);
        
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" >
                    <DollarSign className="h-4 w-4" />
                    <span className="sr-only">Toggle currency</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="size-40 overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {supportedCurrencies.map((currency) => (
                        <Button key={currency} variant="ghost" size="icon" className="w-full" >
                            {currency}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}