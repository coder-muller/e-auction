"use client"

import { User, MapPin, Shield, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "./_components/profile-header"
import { ProfileInfoForm } from "./_components/profile-info-form"
import { AddressForm } from "./_components/address-form"
import { PaymentForm } from "./_components/payment-form"
import { ActiveSessions } from "./_components/active-sessions"
import { SecuritySettings } from "./_components/security-settings"
import { OwnAuctionsTab } from "./_components/own-auctions-tab"
import { ParticipatingAuctionsTab } from "./_components/participating-auctions-tab"
import {
    mockUser,
    mockAddress,
    mockSessions,
    mockOwnAuctions,
    mockParticipatingAuctions,
} from "./_components/mock-data"
import type { ProfileFormValues, AddressFormValues, PaymentFormValues } from "./_components/schemas"

export default function ProfilePage() {
    const handleProfileSubmit = (data: ProfileFormValues) => {
        console.log("Profile data:", data)
        // Aqui você fará a chamada à API
    }

    const handleAddressSubmit = (data: AddressFormValues) => {
        console.log("Address data:", data)
        // Aqui você fará a chamada à API
    }

    const handlePaymentSubmit = (data: PaymentFormValues) => {
        console.log("Payment data:", data)
        // Aqui você fará a chamada à API
    }

    const handleRevokeSession = (sessionId: string) => {
        console.log("Revoking session:", sessionId)
        // Aqui você fará a chamada à API
    }

    const handleTwoFactorChange = (enabled: boolean) => {
        console.log("2FA changed:", enabled)
        // Aqui você fará a chamada à API
    }

    const handleDeleteAccount = () => {
        console.log("Deleting account")
        // Aqui você fará a chamada à API
    }

    const handleViewAuctionDetails = (auctionId: string) => {
        console.log("Viewing auction:", auctionId)
        // Aqui você navegará para a página de detalhes
    }

    const handlePlaceBid = (auctionId: string) => {
        console.log("Placing bid on auction:", auctionId)
        // Aqui você navegará para fazer um lance
    }

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <ProfileHeader user={mockUser} />

            <Tabs defaultValue="profile" className="w-full flex flex-col gap-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">
                        <User className="size-4" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="auctions">
                        <TrendingUp className="size-4" />
                        Leilões
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        <Shield className="size-4" />
                        Conta
                    </TabsTrigger>
                    <TabsTrigger value="address">
                        <MapPin className="size-4" />
                        Endereço
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <ProfileInfoForm defaultValues={mockUser} onSubmit={handleProfileSubmit} />
                </TabsContent>

                <TabsContent value="address" className="space-y-4">
                    <AddressForm defaultValues={mockAddress} onSubmit={handleAddressSubmit} />
                </TabsContent>

                <TabsContent value="auctions" className="space-y-4">
                    <Tabs defaultValue="own" className="w-full">
                        <TabsList>
                            <TabsTrigger value="own">Meus Leilões</TabsTrigger>
                            <TabsTrigger value="participating">Participando</TabsTrigger>
                        </TabsList>

                        <TabsContent value="own" className="space-y-4">
                            <OwnAuctionsTab auctions={mockOwnAuctions} onViewDetails={handleViewAuctionDetails} />
                        </TabsContent>

                        <TabsContent value="participating" className="space-y-4">
                            <ParticipatingAuctionsTab
                                auctions={mockParticipatingAuctions}
                                onPlaceBid={handlePlaceBid}
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                <TabsContent value="account" className="space-y-4">
                    <PaymentForm
                        defaultValues={{
                            cardNumber: "1234 5678 9012 3456",
                            cardName: "GUILHERME MULLER",
                            expiryDate: "12/25",
                            cvv: "123",
                        }}
                        onSubmit={handlePaymentSubmit}
                    />
                    <ActiveSessions sessions={mockSessions} onRevokeSession={handleRevokeSession} />
                    <SecuritySettings
                        twoFactorEnabled={false}
                        onTwoFactorChange={handleTwoFactorChange}
                        onDeleteAccount={handleDeleteAccount}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
