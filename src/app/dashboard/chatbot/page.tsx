
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const chatbotSettingsSchema = z.object({
  context: z.string().min(10, {
    message: "O contexto deve ter pelo menos 10 caracteres.",
  }).max(4000, {
      message: "O contexto não pode exceder 4000 caracteres."
  }),
});

export default function ChatbotSettingsPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof chatbotSettingsSchema>>({
    resolver: zodResolver(chatbotSettingsSchema),
    defaultValues: {
      context: "Você é uma secretária virtual para uma empresa de agendamentos. Seu nome é MIA (MyBotMe Intelligent Assistant). Você deve ser amigável, profissional e eficiente. Seu objetivo principal é ajudar os clientes a agendar, reagendar ou cancelar compromissos. Sempre confirme os detalhes do agendamento com o cliente antes de finalizar. Não faça piadas nem use uma linguagem excessivamente informal.",
    },
  });

  function onSubmit(values: z.infer<typeof chatbotSettingsSchema>) {
    console.log("Chatbot Context:", values);
    toast({
      title: "Configurações Salvas!",
      description: "O contexto do seu chatbot foi atualizado com sucesso.",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Chatbot</CardTitle>
          <CardDescription>
            Defina a personalidade e o comportamento do seu assistente de I.A.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>O que é o Contexto?</AlertTitle>
            <AlertDescription>
              O contexto (ou "prompt de sistema") é um conjunto de instruções que a inteligência artificial seguirá em todas as conversas. Ele define o tom, a personalidade e as regras que seu bot deve seguir. Pense nele como o "manual de treinamento" do seu assistente.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Contexto da I.A.</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Você é um assistente virtual amigável para uma barbearia..."
                        className="min-h-[250px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Seja claro e detalhado. Quanto melhor a instrução, mais eficaz será o seu bot. Limite de 4000 caracteres.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="font-bold">Salvar Configurações</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
