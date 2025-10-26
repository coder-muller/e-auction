import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="absolute inset-0 flex justify-center items-center flex-col w-full h-screen">
            <header className="fixed top-0 left-0 right-0 flex justify-between items-center w-full px-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-semibold leading-none tracking-tighter">e-Auction</span>
                </Link>
                <ThemeSwitcher />
            </header>
            <div className="flex-1 flex justify-center items-center w-full">
                {children}
            </div>
        </main>
    )
}