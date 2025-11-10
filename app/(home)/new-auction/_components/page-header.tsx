"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PageHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="size-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-end">
        <h1 className="text-2xl font-bold">Criar Novo Leilão</h1>
        <p className="text-sm text-muted-foreground">
          Preencha as informações abaixo para criar seu leilão
        </p>
      </div>
    </div>
  )
}

