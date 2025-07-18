
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
                <CardTitle>Seu Plano Atual</CardTitle>
                <CardDescription>Informações sobre sua assinatura.</CardDescription>
            </div>
            <Star className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold">Plano Pro</div>
            <p className="text-xs text-muted-foreground pt-1">
                Sua assinatura será renovada em 30 de Julho de 2024.
            </p>
        </CardContent>
        <div className="p-6 pt-0">
             <Button asChild className="w-full">
                <Link href="#">Gerenciar Assinatura</Link>
            </Button>
        </div>
      </Card>
    </div>
  );
}
