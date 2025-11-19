"use client"

// Components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, LogIn } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { LogOut } from "lucide-react";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Header() {
    const { setTheme, theme } = useTheme();
    const { signOut } = useAuthActions()
    const router = useRouter()

    const user = useQuery(api.auth.loggedInUser)
    const notifications = useQuery(api.notifications.getNotifications) || []
    const seeNotifications = useMutation(api.notifications.seeNotifications)

    const handleSeeNotifications = async () => {
        seeNotifications
        toast.success("notificações marcadas como lidas")
    }

    const handleToggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    const handleLogOut = async () => {
        await signOut()
        router.push("/")
        toast("saindo...")
    }

    return (
        <div className="w-full flex justify-between items-center p-4 border-b border-border">
            <Link href="/">
                <h1 className="text-2xl font-bold font-mono">e-Auction</h1>
            </Link>

            {user ?
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost">
                                <Bell />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-4" align="end">
                            <div>
                                <h1 className="text-lg font-semibold mb-3">Notificações</h1>
                                {notifications?.length > 0 ? (
                                    <>
                                        <Button onClick={handleSeeNotifications} variant="outline" className="w-full my-2">
                                            Limpar notificações
                                        </Button>
                                        <ul className="space-y-3">
                                            {notifications?.map((n) => {
                                                if (n?.type === "outbid") return (
                                                    <li key={n._id} className="flex items-start gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
                                                        <span className="inline-block mt-1 text-blue-500">
                                                            <Bell size={18} />
                                                        </span>
                                                        <div>
                                                            <p className="text-sm">
                                                                Seu lance em <span className="font-medium">{n.item?.title}</span> foi vencido.
                                                            </p>
                                                            <span className="text-xs text-muted-foreground">2 minutes ago</span>
                                                        </div>
                                                    </li>
                                                )
                                                if (n?.type === "itemSoldBidder") return (
                                                    <li key={n._id} className="flex items-start gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
                                                        <span className="inline-block mt-1 text-green-500">
                                                            <Crown size={18} />
                                                        </span>
                                                        <div>
                                                            <p className="text-sm">
                                                                Congratulations! You won the auction for <span className="font-medium">{n?.item?.title}</span>.
                                                            </p>
                                                            <span className="text-xs text-muted-foreground">1 hour ago</span>
                                                        </div>
                                                    </li>
                                                )
                                                if (n?.type === "newBid") return (
                                                    <li key={n._id} className="flex items-start gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
                                                        <span className="inline-block mt-1 text-yellow-500">
                                                            <PlusCircle size={18} />
                                                        </span>
                                                        <div>
                                                            <p className="text-sm">
                                                                Your item <span className="font-medium">{n?.item?.title}</span> has a new bid.
                                                            </p>
                                                            <span className="text-xs text-muted-foreground">3 hours ago</span>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </>
                                ) : (
                                    <p>Você não tem novas notificações.</p>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <User />
                                <span className="hidden md:block">{user?.name}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href="/profile">
                                <DropdownMenuItem className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="size-8 rounded-md">
                                            <AvatarImage src="https://placehold.jp/150x150.png" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{user?.name}</p>
                                                <Crown className="size-3 text-yellow-500" />
                                            </div >
                                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                                        </div >
                                    </div >
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <Link href="/new-auction">
                                <DropdownMenuItem className="group cursor-pointer">
                                    <PlusCircle />
                                    Criar Leilão
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={handleToggleTheme} className="group cursor-pointer">
                                <Sun className="dark:block hidden group-hover:rotate-90 transition-transform duration-300 ease-in-out" />
                                <Moon className="block dark:hidden group-hover:rotate-360 transition-transform duration-300 ease-in-out" />
                                Trocar Tema
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="hover:text-destructive focus:text-destructive group transition-colors duration-300 cursor-pointer">
                                <Button onClick={() => handleLogOut()} variant="ghost">
                                    <LogOut className="group-hover:text-destructive group-focus:text-destructive transition-colors duration-300" />
                                    Sair
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuContent >
                    </DropdownMenu >
                </div >
                :
                <Button asChild>
                    <Link href="/login">
                        <LogIn />
                        Fazer login
                    </Link>
                </Button>
            }
        </div >
    )
}
