"use client"

import { Field, FieldLabel, FieldContent, FieldError, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Controller } from "react-hook-form"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import OAuthButtons from "../../o-auth-buttons"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
    email: z.email("Email inválido").trim(),
    password: z.string().min(1, "Senha é obrigatória").trim(),
})

export default function LoginForm() {

    // Router
    const router = useRouter()

    // Form
    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // Submit handler
    const onSubmitLogin = (data: z.infer<typeof loginSchema>) => {
        // TODO: Implement login
        router.push("/")
    }

    return (
        <form onSubmit={loginForm.handleSubmit(onSubmitLogin)}>
            <FieldGroup>
                <Controller control={loginForm.control} name="email" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <FieldContent>
                            <Input id={field.name} aria-invalid={fieldState.invalid} type="email" placeholder="exemplo@email.com" {...field} disabled={loginForm.formState.isSubmitting} autoComplete="off" />
                        </FieldContent>
                        {fieldState.error && (
                            <FieldError>
                                {fieldState.error.message}
                            </FieldError>
                        )}
                    </Field>
                )} />
                <Controller control={loginForm.control} name="password" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                        <FieldContent>
                            <Input id={field.name} aria-invalid={fieldState.invalid} type="password" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" {...field} disabled={loginForm.formState.isSubmitting} autoComplete="off" />
                        </FieldContent>
                        {fieldState.error && (
                            <FieldError>
                                {fieldState.error.message}
                            </FieldError>
                        )}
                    </Field>
                )} />
                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                    {loginForm.formState.isSubmitting ? <Spinner /> : "Entrar"}
                </Button>
                <p className="text-sm text-center">
                    Não tem uma conta? <Link href="/register" className="text-primary hover:text-primary/80 font-medium hover:underline">Cadastre-se</Link>
                </p>
                <FieldSeparator className="my-2" />
                <OAuthButtons isSubmitting={loginForm.formState.isSubmitting} />
            </FieldGroup>
        </form>
    )
}