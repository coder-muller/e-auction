"use client"

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, use, useState } from "react";
import { auctions, vendors, bidHistory } from "@/lib/fake-data";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const bidFormSchema = z.object({
    amount: z.number().min(1),
});

function CountdownTimer({ endTime }: { endTime: number }) {
    const [timeLeft, setTimeLeft] = useState<string>("");
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

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
                    {vendor.totalSales} vendas realizadas
                </p>
            </CardContent>
        </Card>
    );
};

const BidHistory = ({ auctionId }: { auctionId: Id<"items"> }) => {
    const bids: any[] = []

    return (
        <Card>
            <CardHeader>
                <CardTitle>Maiores Lances</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {bids.map((bid, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">{bid.bidder}</p>
                                <p className="text-xs text-muted-foreground">{bid.time}</p>
                            </div>
                            <span className="font-semibold">
                                {bid.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
    const auction = useQuery(api.items.get, { itemId: auctionId })

    const [bidAmount, setBidAmount] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        console.log(auction);
    }, [auction]);

    const handleBidSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!auction) return;

        const bidValue = parseFloat(bidAmount.replace(/[^\d,]/g, '').replace(',', '.'));
        if (!bidValue || bidValue <= (auction.lastBidValue ?? auction.startingPrice)) {
            toast.error("O lance deve ser maior que o lance atual");
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Lance realizado com sucesso!");
            setBidAmount("");
        } catch {
            toast.error("Erro ao realizar lance");
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

    const isEnded = new Date() > auction.endTime;

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
                        <CardDescription className="text-sm text-muted-foreground">
                            {auction.city} • {auction.state}
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
                                    Lance atual: {auction.lastBidValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </CardDescription>
                            }
                        </CardHeader>
                        <CardContent>
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
