'use client'
import { CardContent } from "../ui/card";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { format } from "@/lib/utils";
export default function FormattedTotal({total}: {total: number}) {
    const container = useRef(null);
    const para = useRef(null);
    useGSAP(() => {
        const counter = {val:0}
        const duration = total / 300;
        gsap.to(counter,{
            val:total,
            duration:duration,
            ease:'power3.out',
            onUpdate:()=>{
                para.current.textContent = format.format(counter.val)
            }
        })
    }, {scope:container, dependencies:[total]});
    return (
        <CardContent ref={container}>
            <p ref={para} className="sm:text-xl text-lg">$0.00</p>
        </CardContent>
    );
}