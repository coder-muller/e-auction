"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import {
    PageHeader,
    BasicInfoSection,
    PriceDateSection,
    LocationSection,
    ShippingSection,
    ImageUploadSection,
    FormActions,
    auctionSchema,
    type AuctionFormValues,
} from "./_components"

export default function NewAuctionPage() {
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<AuctionFormValues>({
        resolver: zodResolver(auctionSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            condition: "",
            startingPrice: 0,
            city: "",
            state: "",
            endDate: "",
            endTime: "",
            shippingMethod: "",
            images: [],
        },
    })

    const onSubmit = async (data: AuctionFormValues) => {
        setIsSubmitting(true)
        try {
            // Simular upload de imagens e criação do leilão
            await new Promise((resolve) => setTimeout(resolve, 2000))

            console.log("Auction data:", data)
            toast.success("Leilão criado com sucesso!")

            // Reset form
            form.reset()
            setImagePreviews([])
        } catch {
            toast.error("Erro ao criar leilão. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">
            <PageHeader />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <BasicInfoSection form={form} />
                    <ImageUploadSection
                        form={form}
                        imagePreviews={imagePreviews}
                        onImagePreviewsChange={setImagePreviews}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-4 col-span-2">
                            <LocationSection form={form} />
                            <ShippingSection form={form} />
                        </div>
                        <PriceDateSection form={form} />
                    </div>
                    <FormActions isSubmitting={isSubmitting} />
                </form>
            </Form>
        </div>
    )
}
