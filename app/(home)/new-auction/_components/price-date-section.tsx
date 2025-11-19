"use client"

import { DollarSign, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import type { UseFormReturn } from "react-hook-form"
import type { AuctionFormValues } from "./schemas"

interface PriceDateSectionProps {
    form: UseFormReturn<AuctionFormValues>
}

export function PriceDateSection({ form }: PriceDateSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="size-5" />
                    Preço e Prazo
                </CardTitle>
                <CardDescription>Defina o preço inicial e quando o leilão termina</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="startingPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preço Inicial (R$)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="R$ 0,00"
                                    {...field}
                                    inputMode="numeric"
                                    onChange={(e) => {
                                        const raw = e.target.value.replace(/\D/g, ""); // só números
                                        const cents = Number(raw) / 100;

                                        const formatted = cents.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        });

                                        field.onChange(formatted);

                                        e.target.setSelectionRange(formatted.length, formatted.length);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Valor mínimo que você aceita pelo item.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Data de Término
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="date"
                                        min={new Date().toISOString().split("T")[0]}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hora de Término</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

