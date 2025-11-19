import * as z from "zod"

// Schema de validação para dados pessoais
export const profileSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email(),
    phone: z.string().optional(),
})

// Schema de validação para endereço
export const addressSchema = z.object({
    street: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro é obrigatório"),
    city: z.string().min(2, "Cidade é obrigatória"),
    state: z.string().length(2, "Estado deve ter 2 caracteres"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
})

// Schema de validação para forma de pagamento
export const paymentSchema = z.object({
    cardNumber: z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Número do cartão inválido"),
    cardName: z.string().min(3, "Nome no cartão é obrigatório"),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Data inválida (MM/AA)"),
    cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido"),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type AddressFormValues = z.infer<typeof addressSchema>
export type PaymentFormValues = z.infer<typeof paymentSchema>

