// Tipos para dados mockados (serão substituídos por tipos reais quando integrar com backend)

import { Id } from "@/convex/_generated/dataModel"

export type User = {
    name: string
    email?: string
    phone?: string
    avatar?: string
}

export type Address = {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
}

export type Session = {
    id: string
    device: string
    location: string
    lastActive: string
    current: boolean
}

export type OwnAuction = {
    _id: string
    title: string
    lastBidValue: number
    expiringAt: string
    status: "live" | "ended" | "draft"
    bids: Id<"bids">[]
}

export type ParticipatingAuction = {
    id: string
    title: string
    myBid: number
    currentBid: number
    endTime: string
    status: "leading" | "outbid"
    leadingBidder: string
}

