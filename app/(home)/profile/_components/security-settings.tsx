"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SecuritySettingsProps {
  twoFactorEnabled?: boolean
  onTwoFactorChange?: (enabled: boolean) => void
  onDeleteAccount?: () => void
}

export function SecuritySettings({
  twoFactorEnabled = false,
  onTwoFactorChange,
  onDeleteAccount,
}: SecuritySettingsProps) {
  const [twoFA, setTwoFA] = useState(twoFactorEnabled)

  const handleTwoFAChange = (checked: boolean) => {
    setTwoFA(checked)
    onTwoFactorChange?.(checked)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Configure as opções de segurança da sua conta</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="2fa">Autenticação de Dois Fatores (2FA)</Label>
            <p className="text-sm text-muted-foreground">
              Adicione uma camada extra de segurança à sua conta
            </p>
          </div>
          <Switch id="2fa" checked={twoFA} onCheckedChange={handleTwoFAChange} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="delete-account">Excluir Conta Permanentemente</Label>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente removidos.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="size-4 mr-2" />
                Excluir Conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir Conta Permanentemente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e
                  removerá todos os seus dados de nossos servidores. Todos os seus leilões, lances
                  e informações serão perdidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={onDeleteAccount}
                >
                  Sim, excluir permanentemente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

