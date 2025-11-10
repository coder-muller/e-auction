"use client"

import { Clock, Award, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ParticipatingAuction } from "./types"

interface ParticipatingAuctionsTabProps {
  auctions: ParticipatingAuction[]
  onPlaceBid?: (auctionId: string) => void
}

export function ParticipatingAuctionsTab({
  auctions,
  onPlaceBid,
}: ParticipatingAuctionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leilões que Você Está Participando</CardTitle>
        <CardDescription>Acompanhe seus lances e o status dos leilões</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{auction.title}</h3>
                    {auction.status === "leading" ? (
                      <Badge variant="default" className="gap-1">
                        <Award className="size-3" />
                        Você está na frente
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="size-3" />
                        Lance superado
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Seu lance:</span>
                      <p className="font-semibold">R$ {auction.myBid.toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Lance atual:</span>
                      <p className="font-semibold">R$ {auction.currentBid.toLocaleString("pt-BR")}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Líder:</span>
                      <p className="font-semibold">{auction.leadingBidder}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tempo restante:</span>
                      <p className="font-semibold flex items-center gap-1">
                        <Clock className="size-3" />
                        {auction.endTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {auction.status === "outbid" && (
                <Button className="w-full mt-2" onClick={() => onPlaceBid?.(auction.id)}>
                  Fazer Novo Lance
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

