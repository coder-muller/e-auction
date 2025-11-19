"use client"

import { Auction } from "../page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function CountdownTimer({ endTime }: { endTime: number }) {
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
                setTimeLeft("Encerrado");
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [endTime]);

    return <span className="font-mono flex items-center justify-center gap-2">{timeLeft === "" ? <Skeleton className="w-23 h-4" /> : timeLeft}</span>;
}

interface NewestTabProps {
    auctions: Auction[];
}

export function NewestTab({ auctions }: NewestTabProps) {
    return (
        <>
            {auctions
                .sort((a, b) => new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime())
                .map((auction) => (
                    <Card key={auction._id} className="overflow-hidden p-0 hover:shadow-lg transition-shadow">
                        <div className="relative aspect-[4/3] w-full">
                            <Image
                                src={auction.imageUrl || "https://placehold.jp/150x150.png"}
                                alt={auction.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                            />
                        </div>
                        <CardHeader className="gap-2">
                            <CardTitle className="text-base">{auction.title}</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">
                                <pre className="overflow-x-clip">{auction.description}</pre>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="h-full space-y-3 pb-6 flex flex-col justify-end">
                            <div className="flex flex-col items-center justify-between gap-3">
                                {auction.currentBid &&
                                    <div className="flex flex-col items-center justify-center font-semibold">
                                        <span className="text-xs font-normal text-muted-foreground"> ultimo lance</span>
                                        <span className="text-lg font-semibold">
                                            {auction.currentBid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                        </span>
                                    </div>
                                }
                                <Link href={`/${auction._id}`} className="w-full">
                                    <Button className="shrink-0 w-full">Mais informações</Button>
                                </Link>
                            </div>
                            <span className="text-xs text-center text-muted-foreground">
                                Termina em <CountdownTimer endTime={auction.expiringAt} />
                            </span>
                        </CardContent>
                    </Card>
                ))}
        </>
    );
}
