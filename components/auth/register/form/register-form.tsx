"use client"

import { Field, FieldLabel, FieldContent, FieldError, FieldGroup, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Controller } from "react-hook-form"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import OAuthButtons from "../../o-auth-buttons"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").trim(),
    email: z.email("Email inválido").trim(),
    password: z.string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "A senha deve conter ao menos uma letra maiúscula e um número")
        .trim(),
})

export default function RegisterForm() {

    // Router
    const router = useRouter()

    // Form
    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    // Submit handler
    const onSubmitRegister = (data: z.infer<typeof registerSchema>) => {
        // TODO: Implement register

        router.push("/")

    }

    return (
        <form onSubmit={registerForm.handleSubmit(onSubmitRegister)}>

            <FieldGroup>
                <Controller control={registerForm.control} name="name" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Nome</FieldLabel>
                        <FieldContent>
                            <Input
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                type="text"
                                placeholder="João da Silva"
                                {...field}
                                disabled={registerForm.formState.isSubmitting}
                                autoComplete="off"
                            />
                        </FieldContent>
                        {fieldState.error && (
                            <FieldError>
                                {fieldState.error.message}
                            </FieldError>
                        )}
                    </Field>
                )} />
                <Controller control={registerForm.control} name="email" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <FieldContent>
                            <Input
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                type="email"
                                placeholder="exemplo@email.com"
                                {...field}
                                disabled={registerForm.formState.isSubmitting}
                                autoComplete="off"
                            />
                        </FieldContent>
                        {fieldState.error && (
                            <FieldError>
                                {fieldState.error.message}
                            </FieldError>
                        )}
                    </Field>
                )} />
                <Controller control={registerForm.control} name="password" render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Senha</FieldLabel>
                        <FieldContent>
                            <Input
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                type="password"
                                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                {...field}
                                disabled={registerForm.formState.isSubmitting}
                                autoComplete="off"
                            />
                        </FieldContent>
                        {fieldState.error && (
                            <FieldError>
                                {fieldState.error.message}
                            </FieldError>
                        )}
                    </Field>
                )} />

                <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                    {registerForm.formState.isSubmitting ? <Spinner /> : "Cadastrar"}
                </Button>
                <p className="text-sm text-center">
                    Já tem uma conta? <Link href="/login" className="text-primary hover:text-primary/80 font-medium hover:underline">Faça login</Link>
                </p>

                <FieldSeparator className="my-2" />

                <OAuthButtons isSubmitting={registerForm.formState.isSubmitting} />

            </FieldGroup>
        </form>
    )
}