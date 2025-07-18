import { Skeleton } from "@/components/ui/skeleton"

export default function FaqSkeleton() {
  return (
    <section id="faq-skeleton" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Perguntas Frequentes
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Respostas para as dúvidas mais comuns sobre o MyBotMe.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 border-b pb-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
