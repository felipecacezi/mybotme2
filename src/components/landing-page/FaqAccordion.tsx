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
    
    return content
      .split('**')
      .filter(Boolean)
      .reduce<FaqItem[]>((acc, item, index) => {
        if (index % 2 === 0) {
          const [question, ...answerParts] = item.split('?');
          const answer = answerParts.join('?').trim();
          acc.push({ question: `${question}?`, answer });
        }
        return acc;
      }, []);
  };

  const faqs = parseFaq(faqContent);

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
