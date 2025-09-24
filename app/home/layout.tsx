"use client"

// Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Icons
import { Bell, Crown, LogOut, Moon, PlusCircle, Sun, User } from "lucide-react";

// Hooks
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
                <h1 className="text-2xl font-bold font-mono">e-Auction</h1>
                <div className="flex items-center gap-2">

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost">
                                <Bell />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <div>
                                <h1 className="text-lg font-semibold mb-3">Notifications</h1>

                                <Button variant="outline" className="w-full my-2">
                                    Clear all notifications
                                </Button>

                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
                                        <span className="inline-block mt-1 text-blue-500">
                                            <Bell size={18} />
                                        </span>
                                        <div>
                                            <p className="text-sm">
                                                Your bid on <span className="font-medium">&quot;Rolex Submariner&quot;</span> was outbid.
                                            </p>
                                            <span className="text-xs text-muted-foreground">2 minutes ago</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
                                        <span className="inline-block mt-1 text-green-500">
                                            <Crown size={18} />
                                        </span>
                                        <div>
                                            <p className="text-sm">
                                                Congratulations! You won the auction for <span className="font-medium">&quot;Vintage Porsche 911&quot;</span>.
                                            </p>
                                            <span className="text-xs text-muted-foreground">1 hour ago</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
                                        <span className="inline-block mt-1 text-yellow-500">
                                            <PlusCircle size={18} />
                                        </span>
                                        <div>
                                            <p className="text-sm">
                                                New auction <span className="font-medium">&quot;Diamond Necklace 5ct&quot;</span> is now live.
                                            </p>
                                            <span className="text-xs text-muted-foreground">3 hours ago</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <User />
                                <span className="hidden md:block">Guilherme Müller</span>
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
                            <DropdownMenuItem className="group cursor-pointer">
                                <PlusCircle />
                                Create Auction
                            </DropdownMenuItem>
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
            <main className="flex-1 w-full h-full overflow-y-auto p-4 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}