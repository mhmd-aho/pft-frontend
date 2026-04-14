import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "FinFlow | Welcome",
  description: "Welcome to FinFlow where u can track your finances",
};
export default function Home() {
  return (
    <section className="w-screen h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold font-heading">Fin<span className="text-primary">Flow</span></h1>
      <p className="sm:text-xl text-md text-center">Master your money with the most intuitive way to track income, 
          manage expenses, and reach your financial goals.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/auth/signup">Get Started</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    </section>
  );
}
