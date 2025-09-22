import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut, Plus, Sun, User } from "lucide-react";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                            <DropdownMenuItem>
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8 rounded-md">
                                        <AvatarImage src="https://github.com/coder-muller.png" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium">John Doe</p>
                                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Sun />
                                Light Mode
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:text-destructive focus:text-destructive group transition-colors duration-300">
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