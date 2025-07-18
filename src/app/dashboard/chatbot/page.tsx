
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Info, Plus, Trash2, Pencil, BotMessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const chatbotSettingsSchema = z.object({
  context: z.string().min(10, {
    message: "O contexto deve ter pelo menos 10 caracteres.",
  }).max(4000, {
      message: "O contexto não pode exceder 4000 caracteres."
  }),
});

const commonMessageSchema = z.object({
    order: z.coerce.number().min(1, "A ordem deve ser pelo menos 1."),
    message: z.string().min(1, "A mensagem não pode estar vazia."),
});

type CommonMessage = z.infer<typeof commonMessageSchema> & { id: number };

export default function ChatbotSettingsPage() {
  const { toast } = useToast();
  const [commonMessages, setCommonMessages] = useState<CommonMessage[]>([
    { id: 1, order: 1, message: "Olá! Bem-vindo à nossa barbearia. Como posso ajudar?" },
    { id: 2, order: 2, message: "Selecione uma opção: 1. Agendar, 2. Ver horários, 3. Falar com atendente." },
  ]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);


  const aiForm = useForm<z.infer<typeof chatbotSettingsSchema>>({
    resolver: zodResolver(chatbotSettingsSchema),
    defaultValues: {
      context: "Você é uma secretária virtual para uma empresa de agendamentos. Seu nome é MIA (MyBotMe Intelligent Assistant). Você deve ser amigável, profissional e eficiente. Seu objetivo principal é ajudar os clientes a agendar, reagendar ou cancelar compromissos. Sempre confirme os detalhes do agendamento com o cliente antes de finalizar. Não faça piadas nem use uma linguagem excessivamente informal.",
    },
  });
  
  const commonMessageForm = useForm<z.infer<typeof commonMessageSchema>>({
    resolver: zodResolver(commonMessageSchema),
    defaultValues: {
      order: commonMessages.length > 0 ? Math.max(...commonMessages.map(m => m.order)) + 1 : 1,
      message: "",
    },
  });

  function onAiSubmit(values: z.infer<typeof chatbotSettingsSchema>) {
    console.log("Chatbot Context:", values);
    toast({
      title: "Configurações de I.A. Salvas!",
      description: "O contexto do seu chatbot foi atualizado com sucesso.",
    });
  }

  function onCommonMessageSubmit(values: z.infer<typeof commonMessageSchema>) {
    if (editingMessageId !== null) {
      // Update existing message
      setCommonMessages(prev => prev.map(msg => msg.id === editingMessageId ? { ...msg, ...values } : msg).sort((a,b) => a.order - b.order));
      setEditingMessageId(null);
       toast({
        title: "Mensagem Atualizada!",
        description: "A mensagem foi salva no fluxo.",
      });
    } else {
      // Add new message
      setCommonMessages(prev => [...prev, { ...values, id: Date.now() }].sort((a, b) => a.order - b.order));
      toast({
        title: "Mensagem Adicionada!",
        description: "A nova mensagem foi adicionada ao fluxo.",
      });
    }

    commonMessageForm.reset({
      order: commonMessages.length > 0 ? Math.max(...commonMessages.map(m => m.order), values.order) + 1 : 1,
      message: "",
    });
  }
  
  function handleEditMessage(message: CommonMessage) {
    setEditingMessageId(message.id);
    commonMessageForm.setValue("order", message.order);
    commonMessageForm.setValue("message", message.message);
  }

  function handleCancelEdit() {
    setEditingMessageId(null);
    commonMessageForm.reset({
      order: commonMessages.length > 0 ? Math.max(...commonMessages.map(m => m.order)) + 1 : 1,
      message: "",
    });
  }

  function handleDeleteMessage(id: number) {
    setCommonMessages(prev => prev.filter(msg => msg.id !== id));
    toast({
      variant: "destructive",
      title: "Mensagem Removida",
      description: "A mensagem foi removida do fluxo.",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Chatbot com I.A.</CardTitle>
          <CardDescription>
            Defina a personalidade e o comportamento do seu assistente de Inteligência Artificial.
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
          <Form {...aiForm}>
            <form onSubmit={aiForm.handleSubmit(onAiSubmit)} className="space-y-8">
              <FormField
                control={aiForm.control}
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
              <Button type="submit" className="font-bold">Salvar Configurações da I.A.</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fluxo de Mensagens (Chatbot Comum)</CardTitle>
          <CardDescription>
            Crie um fluxo de mensagens pré-definidas para um atendimento sem I.A., baseado em regras e ordem.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...commonMessageForm}>
              <form onSubmit={commonMessageForm.handleSubmit(onCommonMessageSubmit)} className="space-y-4 mb-6 p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-4">
                  <FormField
                    control={commonMessageForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ordem</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={commonMessageForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Digite a mensagem do bot..." {...field} className="min-h-[40px]"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                    {editingMessageId && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancelar Edição</Button>
                    )}
                    <Button type="submit" className="font-bold">
                        {editingMessageId ? "Salvar Mensagem" : <><Plus className="mr-2 h-4 w-4"/> Adicionar Mensagem</>}
                    </Button>
                </div>
              </form>
            </Form>

            <Separator className="my-6"/>

            <div className="space-y-4">
                <h3 className="text-md font-semibold text-muted-foreground">Mensagens do Fluxo</h3>
                {commonMessages.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">Nenhuma mensagem cadastrada. Adicione uma acima para começar.</p>
                ) : (
                    <div className="space-y-3">
                        {commonMessages.map(msg => (
                            <div key={msg.id} className="flex items-start gap-4 p-3 border rounded-md bg-muted/50">
                                <div className="flex-shrink-0 flex items-center gap-2">
                                  <BotMessageSquare className="h-5 w-5 text-primary"/>
                                  <span className="font-bold text-lg">{msg.order}.</span>
                                </div>
                                <p className="flex-grow text-sm text-foreground pt-0.5">{msg.message}</p>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditMessage(msg)}>
                                        <Pencil className="h-4 w-4"/>
                                        <span className="sr-only">Editar</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteMessage(msg.id)}>
                                        <Trash2 className="h-4 w-4"/>
                                        <span className="sr-only">Excluir</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    