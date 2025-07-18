import FaqAccordion from './FaqAccordion';

const staticFaqContent = `
**O que é o MyBotMe?**
**MyBotMe é uma plataforma de chatbot com inteligência artificial projetada para automatizar o atendimento ao cliente via WhatsApp. Ela atua como uma secretária virtual para o seu negócio.**

**Preciso de conhecimento técnico para configurar?**
**Não! A integração é simples e projetada para ser feita em poucos cliques, sem necessidade de conhecimento técnico.**

**Como o MyBotMe pode ajudar meu negócio?**
**Ele otimiza a comunicação, responde clientes 24/7, qualifica leads e reduz custos operacionais, permitindo que você foque no crescimento da sua empresa.**

**O atendimento é personalizável?**
**Sim, você pode adaptar o tom de voz, as respostas e todo o fluxo de conversa para se alinhar perfeitamente com a identidade da sua marca.**

**Quais são os principais benefícios de usar o MyBotMe?**
**Os principais benefícios incluem atendimento 24/7, respostas instantâneas, redução de custos com atendimento, fácil integração e personalização total para refletir a identidade da sua marca.**

**O MyBotMe se integra com outros sistemas?**
**Sim, oferecemos integrações com as principais ferramentas de CRM e outras plataformas para otimizar ainda mais seus processos de vendas e atendimento.**

**Existe um período de teste gratuito?**
**Sim! Oferecemos um período de teste para você experimentar todas as funcionalidades do MyBotMe sem compromisso e ver na prática como ele pode transformar seu atendimento.**

**Como funciona o suporte ao cliente?**
**Nossa equipe de suporte está sempre disponível para ajudar com qualquer dúvida ou problema. Oferecemos suporte por e-mail, chat e telefone para garantir que você tenha a melhor experiência possível.**
`;

export default function FaqSection() {
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
          <FaqAccordion faqContent={staticFaqContent} />
        </div>
      </div>
    </section>
  );
}
