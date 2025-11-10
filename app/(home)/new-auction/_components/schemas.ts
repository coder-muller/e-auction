import * as z from "zod"

// Schema de validação para criação de leilão
export const auctionSchema = z.object({
  title: z.string().min(10, "Título deve ter pelo menos 10 caracteres").max(100, "Título muito longo"),
  description: z.string().min(50, "Descrição deve ter pelo menos 50 caracteres").max(5000, "Descrição muito longa"),
  category: z.string().min(1, "Categoria é obrigatória"),
  condition: z.string().min(1, "Condição é obrigatória"),
  startingPrice: z.number().min(1, "Preço inicial deve ser maior que zero"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado deve ter 2 caracteres"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
  endTime: z.string().min(1, "Hora de término é obrigatória"),
  shippingMethod: z.string().min(1, "Método de envio é obrigatório"),
  images: z.array(z.instanceof(File)).min(1, "Adicione pelo menos uma imagem").max(10, "Máximo de 10 imagens"),
})

export type AuctionFormValues = z.infer<typeof auctionSchema>

