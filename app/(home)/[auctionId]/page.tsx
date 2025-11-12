"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, use, useState } from "react";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";

const bidFormSchema = z.object({
    amount: z.string()
});

function CountdownTimer({ endTime }: { endTime: string }) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    useEffect(() => {
        const end = new Date(endTime).getTime()
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = end - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft(`${days > 0 ? `${days}d ` : ""}${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${seconds > 0 ? `${seconds}s ` : ""}`);
            } else {
                setTimeLeft("Leilão encerrado");
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return <span className="font-mono">{timeLeft}</span>;
}

const VendorInfo = ({ sellerId }: { sellerId: Id<"users"> }) => {
    const vendor = useQuery(api.users.getUserById, { userId: sellerId })
    if (!vendor) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="size-5" />
                    Vendedor
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="font-medium">{vendor.name}</span>
                    <div className="flex items-center gap-1">
                        <Star className="size-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{vendor.rating}</span>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    {vendor.items.length} vendas realizadas
                </p>
            </CardContent>
        </Card>
    );
};

function BidHistory({ auctionId }: { auctionId: Id<"items"> }) {
    const bids = useQuery(api.bids.getBidHistory, { itemId: auctionId })?.enrichedBids

    if (bids?.length === 0) return (
        <Card>
            <CardHeader>
                <CardTitle>Maiores Lances</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Ainda não existem lances neste leilão.</p>
                <p>Quem sabe você não faz o primeiro?</p>
            </CardContent>
        </Card>

    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Maiores Lances</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {bids && bids?.map((bid) => (
                        <div key={bid._id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">{String(bid.bidder?.name)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(bid._creationTime).toLocaleString()}</p>
                            </div>
                            <span className="font-semibold">
                                {(bid.amount / 10000).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

interface AuctionPageProps {
    params: Promise<{
        auctionId: Id<"items">;
    }>;
}

export default function AuctionPage({ params }: AuctionPageProps) {
    const resolvedParams = use(params);
    const auctionId: Id<"items"> = resolvedParams.auctionId
    const auction = useQuery(api.items.getItem, { itemId: auctionId })
    const placeBid = useMutation(api.bids.placeBid)

    const [bidAmount, setBidAmount] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof bidFormSchema>>({
        resolver: zodResolver(bidFormSchema),
        defaultValues: {
            amount: ""
        }
    })

    const handleBidSubmit = async () => {
        if (!auction) return;
        const input = Number(bidAmount) * 100

        if (isNaN(input) || input <= 0) {
            form.setError("amount", { message: "valor inválido" })
            toast.error("Por favor, insira um valor válido")
            return
        }

        setIsSubmitting(true);

        try {
            const response = placeBid({ amount: input, itemId: auctionId })
            toast.success((await response).message);
            setBidAmount("");
        } catch (err) {
            const error = err instanceof ConvexError ? err.data : "Ocorreu um erro desconhecido"
            toast.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!auction) {
        return (
            <div className="flex flex-col gap-4 items-center justify-center w-full h-96">
                <TriangleAlert className="size-10 text-muted-foreground" />
                <Label className="text-lg font-semibold">Leilão não encontrado</Label>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Back button */}
            <div className="flex items-center justify-start">
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="size-4" />
                        Voltar
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Image */}
                <Card className="col-span-1 lg:col-span-2 overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">{auction.title}</CardTitle>
                        <CardDescription className="text-sm flex flex-col text-muted-foreground">
                            <span>{auction.city} • {auction.state}</span>
                            <span>{auction.description}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                                src={auction.imageUrl || "https://placehold.jp/150x150.png"}
                                alt={auction.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="col-span-1 space-y-4">
                    {/* Bid Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">Dê um lance</CardTitle>
                            {auction.lastBidValue &&
                                <CardDescription>
                                    Lance atual: {(auction.lastBidValue / 10000).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </CardDescription>
                            }
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleBidSubmit)} className="flex gap-2">
                                        <FormField
                                            name="amount"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel hidden>valor do lance</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            inputMode="numeric"
                                                            placeholder="R$ 0,00"
                                                            onChange={(e) => {
                                                                const raw = e.target.value.replace(/\D/g, ""); // só números
                                                                const cents = Number(raw) / 100;

                                                                const formatted = cents.toLocaleString("pt-BR", {
                                                                    style: "currency",
                                                                    currency: "BRL",
                                                                });

                                                                field.onChange(formatted);

                                                                e.target.setSelectionRange(formatted.length, formatted.length);
                                                                setBidAmount(raw)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : "dar lance"}</Button>
                                    </form>
                                </Form>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Termina em: <CountdownTimer endTime={auction.expiringAt} />
                            </p>
                        </CardContent>
                    </Card>

                    {/* Vendor Info */}
                    <VendorInfo sellerId={auction.sellerId} />

                    {/* Bid History */}
                    <BidHistory auctionId={auction._id} />
                </div>
            </div>
        </div>
    );
}
