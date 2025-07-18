import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full pt-12 md:pt-24 lg:pt-32">
      <div className="container mx-auto px-4 md:px-6 space-y-10 xl:space-y-16">
        <div className="grid max-w-screen-xl mx-auto gap-4 px-4 sm:px-6 md:px-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
              Inteligência Artificial para WhatsApp
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Automatize seu atendimento com uma secretária virtual
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              O MyBotMe transforma seu WhatsApp em uma poderosa ferramenta de vendas e suporte, funcionando 24/7 para você não perder nenhuma oportunidade.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="h-12 text-lg rounded-full font-bold">
                Criar meu Bot Grátis
              </Button>
              <Button size="lg" variant="outline" className="h-12 text-lg rounded-full font-bold border-2">
                Ver Demonstração
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://placehold.co/600x600.png"
              alt="Hero Image"
              width={600}
              height={600}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="chatbot phone"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
