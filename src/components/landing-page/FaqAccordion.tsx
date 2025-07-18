"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqAccordionProps {
  faqContent: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqContent }: FaqAccordionProps) {
  const parseFaq = (content: string): FaqItem[] => {
    if (!content) return [];
    
    const items = content.trim().split(/\n\s*\n/);
    
    return items.map(item => {
      const parts = item.split('**');
      const question = (parts[1] || '').trim();
      const answer = (parts[2] || '').trim();
      return { question, answer };
    }).filter(faq => faq.question && faq.answer);
  };

  const faqs = parseFaq(faqContent);

  if (faqs.length === 0) {
    return <p>Nenhuma pergunta frequente para exibir no momento.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
