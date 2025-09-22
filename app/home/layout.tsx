"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Crown, LogOut, Moon, Plus, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setTheme, theme } = useTheme();

    const handleToggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    return (
        <div className="w-full h-screen flex flex-col">
            {/* header */}
            <div className="w-full flex justify-between items-center p-4 border-b border-border">
                <h1 className="text-2xl font-bold font-mono">E-Auction</h1>
                <div className="flex items-center gap-2">
                    <Button variant="default">
                        <Plus />
                        Create Auction
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <User />
                                John Doe
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8 rounded-md">
                                        <AvatarImage src="https://github.com/coder-muller.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium">Guilherme Müller</p>
                                            <Crown className="size-3 text-yellow-500" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">guilherme.muller@example.com</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleToggleTheme} className="group cursor-pointer">
                                <Sun className="dark:block hidden group-hover:rotate-90 transition-transform duration-300 ease-in-out" />
                                <Moon className="block dark:hidden group-hover:rotate-360 transition-transform duration-300 ease-in-out" />
                                Toggle Theme
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:text-destructive focus:text-destructive group transition-colors duration-300 cursor-pointer">
                                <LogOut className="group-hover:text-destructive group-focus:text-destructive transition-colors duration-300" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* main */}
            <main className="flex-1 overflow-y-auto p-4">
                {children}
            </main>
        </div>
    );
}