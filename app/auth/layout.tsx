import Link from "next/link";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="h-12 w-full flex justify-center items-center">
        <Link href="/">
            <span className="text-2xl font-syne tracking-[-0.04em]">fin<span className="text-primary">flow</span></span>
        </Link>
      </header>
      {children}
    </>
        
  );
}
