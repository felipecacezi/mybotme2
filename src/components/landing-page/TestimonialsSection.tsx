import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "O MyBotMe revolucionou nosso atendimento. Conseguimos reduzir o tempo de resposta em 90% e nossos clientes estão mais satisfeitos.",
    name: "Juliana Silva",
    title: "CEO, InovaTech",
    avatar: "https://placehold.co/40x40.png",
    aiHint: "woman smiling"
  },
  {
    quote: "A implementação foi incrivelmente fácil. Em menos de um dia, já tínhamos nosso bot funcionando e qualificando leads automaticamente.",
    name: "Ricardo Mendes",
    title: "Diretor de Vendas, VendeMais",
    avatar: "https://placehold.co/40x40.png",
    aiHint: "man professional"
  },
  {
    quote: "Finalmente posso focar na estratégia do meu negócio, sabendo que o atendimento inicial está em boas mãos. Recomendo!",
    name: "Carla Souza",
    title: "Fundadora, Estilo & Cia",
    avatar: "https://placehold.co/40x40.png",
    aiHint: "woman portrait"
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Amado por centenas de empresas
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Veja o que nossos clientes estão dizendo sobre como o MyBotMe transformou seus negócios.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card p-6 shadow-md rounded-xl">
              <CardContent className="p-0 flex flex-col gap-4">
                <p className="text-lg font-medium leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.aiHint} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
