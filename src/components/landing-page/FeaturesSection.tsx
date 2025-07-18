import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, Clock, DollarSign, Zap, Settings, Puzzle } from "lucide-react";

const features = [
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "Secretária Virtual Inteligente",
    description: "Nossa I.A. compreende e responde em texto às necessidades dos seus clientes de forma natural e eficiente.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Atendimento 24/7",
    description: "Seu negócio sempre disponível, capturando leads e atendendo clientes a qualquer hora do dia ou da noite.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Respostas Instantâneas",
    description: "Agilidade máxima no atendimento, eliminando filas de espera e aumentando a satisfação do cliente.",
  },
  {
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    title: "Redução de Custos",
    description: "Automatize tarefas repetitivas e otimize o tempo da sua equipe, reduzindo custos operacionais.",
  },
  {
    icon: <Puzzle className="w-8 h-8 text-primary" />,
    title: "Fácil Integração",
    description: "Conecte seu WhatsApp em poucos cliques, sem necessidade de conhecimento técnico.",
  },
  {
    icon: <Settings className="w-8 h-8 text-primary" />,
    title: "Totalmente Personalizável",
    description: "Adapte o estilo de escrita, as respostas e o fluxo de conversa para a identidade da sua marca.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
            Funcionalidades
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Tudo que você precisa para decolar
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            O MyBotMe oferece um conjunto de ferramentas poderoso para transformar seu atendimento no WhatsApp.
          </p>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-none bg-card/50">
              <CardHeader className="gap-4">
                {feature.icon}
                <div className="space-y-2">
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
