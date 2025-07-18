import { generateFaq } from '@/ai/flows/generate-faq';
import FaqAccordion from './FaqAccordion';

const productInformation = `
MyBotMe é uma plataforma de chatbot com inteligência artificial projetada para automatizar o atendimento ao cliente via WhatsApp. 
Ela atua como uma secretária virtual, capaz de responder perguntas frequentes, agendar compromissos, qualificar leads e fornecer suporte 24 horas por dia, 7 dias por semana. 
A integração é simples e não requer conhecimento técnico. 
O objetivo do MyBotMe é otimizar a comunicação, reduzir custos operacionais e melhorar a experiência do cliente, permitindo que as empresas se concentrem em tarefas mais estratégicas. 
As principais funcionalidades incluem respostas instantâneas, personalização de conversas e a capacidade de lidar com múltiplos atendimentos simultaneamente.
`;

export default async function FaqSection() {
  const { faqContent } = await generateFaq({ productInformation });

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32 bg-card">
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
          <FaqAccordion faqContent={faqContent} />
        </div>
      </div>
    </section>
  );
}
