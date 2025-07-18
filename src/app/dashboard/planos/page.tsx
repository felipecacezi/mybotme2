
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const features = [
    "Acesso total à plataforma",
    "Chatbot com Inteligência Artificial",
    "Atendimentos ilimitados",
    "Fluxos de conversa personalizáveis",
    "Integração com WhatsApp",
    "Suporte prioritário por e-mail"
]

export default function PlanosPage() {
  return (
    <div className="flex justify-center items-start py-6">
      <Card className="w-full max-w-md border-primary border-2 shadow-xl">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-primary/10 rounded-full p-3">
                    <Star className="h-8 w-8 text-primary" />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold">Plano Pro</CardTitle>
            <CardDescription>Acesso completo a todas as funcionalidades da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center my-6">
                <span className="text-4xl font-extrabold">R$ 60,00</span>
                <span className="text-lg text-muted-foreground">/mês</span>
            </div>
            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-muted-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
             <Button size="lg" className="w-full font-bold" disabled>
                Seu Plano Atual
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">Sua assinatura será renovada em 30 de Julho de 2024.</p>
        </CardContent>
      </Card>
    </div>
  );
}
