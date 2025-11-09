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
import { paymentSchema, type PaymentFormValues } from "./schemas"

interface PaymentFormProps {
  defaultValues?: Partial<PaymentFormValues>
  onSubmit?: (data: PaymentFormValues) => void
}

const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\s/g, "")
  const match = cleaned.match(/.{1,4}/g)
  return match ? match.join(" ") : cleaned
}

const formatExpiryDate = (value: string) => {
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
  }
  return cleaned
}

export function PaymentForm({ defaultValues, onSubmit }: PaymentFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: defaultValues?.cardNumber || "",
      cardName: defaultValues?.cardName || "",
      expiryDate: defaultValues?.expiryDate || "",
      cvv: defaultValues?.cvv || "",
    },
  })

  const handleSubmit = (data: PaymentFormValues) => {
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
            <CardTitle>Forma de Pagamento</CardTitle>
            <CardDescription>Gerencie seus métodos de pagamento</CardDescription>
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
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Cartão</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        field.onChange(formatted)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome no Cartão</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="NOME COMPLETO"
                      onChange={(e) => {
                        field.onChange(e.target.value.toUpperCase())
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="MM/AA"
                        maxLength={5}
                        onChange={(e) => {
                          const formatted = formatExpiryDate(e.target.value)
                          field.onChange(formatted)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        type="password"
                        placeholder="123"
                        maxLength={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

