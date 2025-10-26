import LoginForm from "@/components/auth/login/form/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    return (
        <main className="flex justify-center items-center w-full h-full">
            <Card className="w-full max-w-xs md:max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Seja bem vindo!</CardTitle>
                    <CardDescription>
                        Faça login para continuar
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </main>
    )
}