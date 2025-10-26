import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import RegisterForm from "@/components/auth/register/form/register-form"

export default function RegisterPage() {
    return (
        <main className="flex justify-center items-center w-full h-full">
            <Card className="w-full max-w-xs md:max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Seja bem vindo!</CardTitle>
                    <CardDescription>
                        Cadastre-se para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RegisterForm />
                </CardContent>
            </Card>
        </main>
    )
}