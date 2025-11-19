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
import { useMutation, } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"


export default function NewAuctionPage() {
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const createItem = useMutation(api.items.create)
    const generateUploadUrl = useMutation(api.items.generateUploadUrl);





    const form = useForm<AuctionFormValues>({
        resolver: zodResolver(auctionSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            condition: "",
            startingPrice: "",
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
        const raw = data.startingPrice.replace(/\D/g, ""); // só números
        try {
            let uploadedStorageIds: Id<"_storage">[] = [];

            if (data.images && data.images.length > 0) {
                const file = data.images[0] as File; 
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                if (!result.ok) {
                    throw new Error(`Upload failed: ${result.statusText}`);
                }

                const { storageId } = await result.json();
                uploadedStorageIds = [storageId];
            }

            await createItem({
                category: data.category,
                city: data.city,
                description: data.description,
                endDate: data.endDate,
                endTime: data.endTime,
                startingPrice: Number(raw),
                state: data.state,
                title: data.title,
                imageStorageIds: uploadedStorageIds, 
            })

            console.log(data)
            toast.success("Leilão criado com sucesso!")
            form.reset()
            setImagePreviews([])
            router.push("/")
        } catch (error) {
            console.error(error);
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
