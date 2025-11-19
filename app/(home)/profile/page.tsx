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
    mockSessions,
    mockOwnAuctions,
    mockParticipatingAuctions,
} from "./_components/mock-data"
import type { ProfileFormValues, AddressFormValues, PaymentFormValues } from "./_components/schemas"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ConvexError } from "convex/values"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ProfilePage() {

    const user = useQuery(api.users.getLoggedInUser)
    const ownAuctions = useQuery(api.items.myItems)
    const profileEdit = useMutation(api.users.profileEdit)
    const addressEdit = useMutation(api.users.addressEdit)
    const router = useRouter()

    if (user === undefined) return <p>carregando...</p>
    if (ownAuctions === undefined) return <p>carregando...</p>

    const handleProfileSubmit = async (data: ProfileFormValues) => {
        const { phone, name } = data

        try {
            profileEdit({
                name,
                phone
            })
            toast.success("Perfil editado com sucesso.")
        } catch (err) {
            const error = err instanceof ConvexError ? err.data : "Ocorreu um erro desconhecido"
            toast.error(error)
        }
    }

    const handleAddressSubmit = (data: AddressFormValues) => {
        try {
            addressEdit(data)
            toast.success("Endereço editado com sucesso.")
        } catch (err) {
            const error = err instanceof ConvexError ? err.data : "Ocorreu um erro desconhecido"
            toast.error(error)
        }
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
        router.push(`/${auctionId}`)

    }

    const handlePlaceBid = (auctionId: string) => {
        console.log("Placing bid on auction:", auctionId)
        // Aqui você navegará para fazer um lance
    }

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
            <ProfileHeader user={{
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar: user.profileImage ?? "https://placehold.jp/150x150png"
            }} />

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile">
                        <User className="size-4" />
                        Perfil
                    </TabsTrigger>
                    <TabsTrigger value="auctions">
                        <TrendingUp className="size-4" />
                        Leilões
                    </TabsTrigger>
                    {
                        /*
                    <TabsTrigger value="account">
                        <Shield className="size-4" />
                        Conta
                    </TabsTrigger>
                    <TabsTrigger value="address">
                        <MapPin className="size-4" />
                        Endereço
                    </TabsTrigger>
                    */
                    }
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                    <ProfileInfoForm defaultValues={{
                        email: user.email,
                        name: user.name,
                        phone: user.phone
                    }} onSubmit={handleProfileSubmit} />
                </TabsContent>

                {
                    /*
                <TabsContent value="address" className="space-y-4">
                    <AddressForm defaultValues={user.address} onSubmit={handleAddressSubmit} />
                </TabsContent>
                    */
                }

                <TabsContent value="auctions" className="space-y-4">
                    <Tabs defaultValue="own" className="w-full">
                        <TabsList>
                            <TabsTrigger value="own">Meus Leilões</TabsTrigger>
                            <TabsTrigger value="participating">Lista de Desejos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="own" className="space-y-4">
                            <OwnAuctionsTab auctions={ownAuctions} onViewDetails={handleViewAuctionDetails} />
                        </TabsContent>

                        <TabsContent value="participating" className="space-y-4">
                            <ParticipatingAuctionsTab
                                auctions={mockParticipatingAuctions}
                                onPlaceBid={handlePlaceBid}
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>

                {
                    /*
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
                    */
                }
            </Tabs>
        </div>
    )
}
