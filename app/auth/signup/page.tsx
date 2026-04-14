import { SignUpForm } from "@/components/app/signup-form";
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "FinFlow | Sign Up",
    description: "Register for a new account",
};
export default function SignUp() {
    return (
        <section className="w-screen h-screen flex items-center justify-center">
            <SignUpForm />
        </section>
    );
}