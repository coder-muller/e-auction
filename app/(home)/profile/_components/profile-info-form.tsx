"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { profileSchema, type ProfileFormValues } from "./schemas"

interface ProfileInfoFormProps {
    defaultValues?: Partial<ProfileFormValues>
    onSubmit?: (data: ProfileFormValues) => void
}

export function ProfileInfoForm({ defaultValues, onSubmit }: ProfileInfoFormProps) {
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: defaultValues?.name || "",
            email: defaultValues?.email || "",
            phone: defaultValues?.phone || "",
        },
    })

    const handleSubmit = (data: ProfileFormValues) => {
        onSubmit?.(data)
        setIsEditing(false)
    }

    const handleCancel = () => {
        setIsEditing(false)
        form.reset()
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>Gerencie suas informações pessoais</CardDescription>
                    </div>
                    {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Edit2 className="size-4 mr-2" />
                            Editar
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                <X className="size-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={form.handleSubmit(handleSubmit)}>
                                <Check className="size-4 mr-2" />
                                Salvar
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome Completo</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            disabled
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={!isEditing} placeholder="+55 (11) 98765-4321" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

