"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface FormActionsProps {
  isSubmitting: boolean
}

export function FormActions({ isSubmitting }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4 pb-6">
      <Link href="/">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </Link>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Criando leilão..." : "Criar Leilão"}
      </Button>
    </div>
  )
}

