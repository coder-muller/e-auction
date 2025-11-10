"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface ImagePreviewProps {
  previews: string[]
  onRemove: (index: number) => void
}

export function ImagePreview({ previews, onRemove }: ImagePreviewProps) {
  if (previews.length === 0) return null

  return (
    <div className="space-y-4">
      <Separator />
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Preview das Imagens ({previews.length}/10)
        </Label>
        {previews.length === 1 ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
            <Image
              src={previews[0]}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => onRemove(0)}
            >
              <X className="size-4" />
            </Button>
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {previews.map((preview, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => onRemove(index)}
                    >
                      <X className="size-4" />
                    </Button>
                    {index === 0 && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Principal
                        </span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </div>
  )
}

