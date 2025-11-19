"use client"

import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { OwnAuction } from "./types"

interface OwnAuctionsTabProps {
    auctions: OwnAuction[]
    onViewDetails?: (auctionId: string) => void
}

export function OwnAuctionsTab({ auctions, onViewDetails }: OwnAuctionsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Leilões Criados por Você</CardTitle>
                <CardDescription>Gerencie seus leilões ativos e finalizados</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {auctions.map((auction) => (
                        <div
                            key={auction._id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold">{auction.title}</h3>
                                    <Badge variant={auction.status === "live" ? "default" : "secondary"}>
                                        {auction.status === "live" ? "Ativo" : "Finalizado"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>
                                        Lance atual:{" "}
                                        <strong className="text-foreground">
                                            R$ {(auction.lastBidValue / 10000).toLocaleString("pt-BR")}
                                        </strong>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {new Date(auction.expiringAt).toLocaleString('pt-BR')}
                                    </span>
                                    <span>{auction.bids ?? [].length} lances</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => onViewDetails?.(auction._id)}>
                                Ver Detalhes
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

