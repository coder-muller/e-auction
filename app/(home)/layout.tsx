import { Header } from "@/components/header";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-full h-screen flex flex-col">
            {/* header */}
            <Header />

            {/* main */}
            <main className="flex-1 w-full h-full overflow-y-auto p-4 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    )
}