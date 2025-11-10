"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { shippingMethods } from "./constants"
import type { UseFormReturn } from "react-hook-form"
import type { AuctionFormValues } from "./schemas"

interface ShippingSectionProps {
  form: UseFormReturn<AuctionFormValues>
}

export function ShippingSection({ form }: ShippingSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de Envio</CardTitle>
        <CardDescription>Como o comprador receberá o item</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="shippingMethod"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o método de envio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {shippingMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

