
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao seu Dashboard!</CardTitle>
          <CardDescription>
            Aqui você pode gerenciar seus bots, visualizar relatórios e muito mais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Este é um protótipo inicial. Novas funcionalidades serão adicionadas em breve!</p>
        </CardContent>
      </Card>
    </div>
  );
}
