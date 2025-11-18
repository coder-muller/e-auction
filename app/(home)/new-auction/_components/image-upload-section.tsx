"use client"

import { useCallback } from "react"
import { Upload, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ImagePreview } from "./image-preview"
import { toast } from "sonner"
import type { UseFormReturn } from "react-hook-form"
import type { AuctionFormValues } from "./schemas"

interface ImageUploadSectionProps {
  form: UseFormReturn<AuctionFormValues>
  imagePreviews: string[]
  onImagePreviewsChange: (previews: string[]) => void
}

export function ImageUploadSection({
  form,
  imagePreviews,
  onImagePreviewsChange,
}: ImageUploadSectionProps) {
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])

      if (files.length === 0) return

      // Validar número máximo de imagens
      const currentImages = form.getValues("images")
      if (currentImages.length + files.length > 1) {
        toast.error("Máximo de 1 imagens permitidas")
        return
      }

      // Validar tipo de arquivo
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
      const invalidFiles = files.filter((file) => !validTypes.includes(file.type))

      if (invalidFiles.length > 0) {
        toast.error("Apenas imagens JPG, PNG ou WEBP são permitidas")
        return
      }

      // Validar tamanho (máximo 5MB por imagem)
      const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
      if (oversizedFiles.length > 0) {
        toast.error("Cada imagem deve ter no máximo 5MB")
        return
      }

      // Criar previews
      const newPreviews: string[] = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === files.length) {
            onImagePreviewsChange([...imagePreviews, ...newPreviews])
            form.setValue("images", [...currentImages, ...files])
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [form, imagePreviews, onImagePreviewsChange]
  )

  const removeImage = useCallback(
    (index: number) => {
      const newPreviews = imagePreviews.filter((_, i) => i !== index)
      onImagePreviewsChange(newPreviews)
      const currentImages = form.getValues("images")
      form.setValue("images", currentImages.filter((_, i) => i !== index))
    },
    [form, imagePreviews, onImagePreviewsChange]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="size-5" />
          Imagens do Item
        </CardTitle>
        <CardDescription>
          Adicione a imagem do anúncio.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Upload de Imagem</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="size-8 text-muted-foreground mb-2" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP até 5MB.
                        </p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  <ImagePreview previews={imagePreviews} onRemove={removeImage} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}

