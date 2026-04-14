import { SignInForm } from "@/components/app/signin-form";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "FinFlow | Sign In",
    description: "login to your account to manage your dashboard.",
}
export default function SignIn() {
    
    return (
        <section className="w-screen h-screen flex items-center justify-center">
            <SignInForm />
        </section>
    );
}