
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Bot, User, Send, PauseCircle, PlayCircle, Hand } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const conversationsData = [
  { id: 1, name: "Maria Silva", lastMessage: "Olá! Gostaria de saber mais sobre o plano Pro.", time: "10:45", unread: 2, avatar: "https://github.com/shadcn.png" },
  { id: 2, name: "João Pereira", lastMessage: "Qual o valor da integração?", time: "09:30", unread: 0, avatar: "https://github.com/vercel.png" },
  { id: 3, name: "Ana Costa", lastMessage: "Obrigada pelo retorno!", time: "Ontem", unread: 0, avatar: "https://github.com/radix-ui.png" },
  { id: 4, name: "+55 11 98765-4321", lastMessage: "Preciso de ajuda com a minha fatura.", time: "Ontem", unread: 1, avatar: null },
  { id: 5, name: "Carlos Souza", lastMessage: "Perfeito, vou finalizar a compra.", time: "2 dias atrás", unread: 0, avatar: "https://github.com/nextjs.png" },
];

const messagesData = {
  1: [
    { from: "customer", text: "Olá! Gostaria de saber mais sobre o plano Pro.", time: "10:40" },
    { from: "bot", text: "Olá, Maria! O Plano Pro custa R$99/mês e inclui automações ilimitadas e suporte prioritário. O que mais você gostaria de saber?", time: "10:41" },
    { from: "customer", text: "Ele se integra com o meu CRM?", time: "10:44" },
    { from: "customer", text: "E tem período de teste?", time: "10:45" },
  ],
  2: [
    { from: "customer", text: "Qual o valor da integração?", time: "09:30" },
    { from: "bot", text: "Olá, João. A integração com sistemas de terceiros é um serviço adicional. Poderia me dizer qual sistema você utiliza para que eu possa verificar a viabilidade e os valores?", time: "09:31" },
  ]
};

const contactDetailsData = {
    1: { name: "Maria Silva", phone: "+55 21 99887-6655", tags: ["Lead Qualificado", "Plano Pro"], botActive: true },
    2: { name: "João Pereira", phone: "+55 11 98765-4321", tags: ["Cliente"], botActive: true },
}


export default function AtendimentosPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(1);
  
  const selectedContact = selectedConversationId ? contactDetailsData[selectedConversationId] || { name: 'Novo Contato', phone: 'Não disponível', tags: [], botActive: true } : null;

  return (
    <div className="flex h-[calc(100vh-73px)] bg-background">
      {/* Conversation List */}
      <aside className="w-full max-w-xs border-r flex flex-col">
        <div className="p-4 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Pesquisar conversas..." className="pl-10" />
            </div>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          {conversationsData.map(convo => (
            <div
              key={convo.id}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50",
                selectedConversationId === convo.id && "bg-muted"
              )}
              onClick={() => setSelectedConversationId(convo.id)}
            >
              <Avatar>
                <AvatarImage src={convo.avatar} />
                <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{convo.name}</p>
                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
              </div>
              <div className="text-xs text-muted-foreground text-right flex flex-col items-end gap-1">
                <span>{convo.time}</span>
                {convo.unread > 0 && (
                  <Badge className="w-5 h-5 flex items-center justify-center p-0">{convo.unread}</Badge>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </aside>

      {/* Chat View */}
      <main className="flex-1 flex flex-col">
        {selectedConversationId && messagesData[selectedConversationId] ? (
            <>
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                {messagesData[selectedConversationId].map((msg, index) => (
                    <div key={index} className={cn("flex items-end gap-3", msg.from === "bot" || msg.from === "agent" ? "flex-row" : "flex-row-reverse")}>
                        <Avatar className="w-8 h-8">
                            <AvatarFallback>
                                {msg.from === 'customer' ? <User size={16} /> : <Bot size={16} />}
                            </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                            "max-w-md p-3 rounded-lg",
                            msg.from === 'bot' && "bg-primary text-primary-foreground",
                            msg.from === 'customer' && "bg-muted"
                        )}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs text-right mt-1 opacity-70">{msg.time}</p>
                        </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t bg-background">
                <div className="relative">
                    <Input placeholder="Digite sua mensagem para intervir..." className="pr-12" />
                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send size={18} />
                    </Button>
                </div>
            </div>
            </>
        ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Selecione uma conversa para começar</p>
            </div>
        )}
      </main>

      {/* Contact Details & Intervention */}
      <aside className="w-full max-w-xs border-l flex flex-col p-6 space-y-6">
        {selectedContact ? (
             <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">{selectedContact.name}</CardTitle>
                    <CardDescription>{selectedContact.phone}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm font-medium mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Controle do Atendimento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="bot-switch" className="flex items-center gap-2 font-semibold">
                            <Bot size={18} />
                            <span>Bot Ativo</span>
                        </Label>
                        <Switch id="bot-switch" checked={selectedContact.botActive} />
                    </div>
                    <Button variant="outline" className="w-full">
                        <PauseCircle className="mr-2" />
                        Pausar Atendimento
                    </Button>
                     <Button variant="outline" className="w-full">
                        <PlayCircle className="mr-2" />
                        Retomar Atendimento
                    </Button>
                    <Button variant="destructive" className="w-full">
                        <Hand className="mr-2" />
                        Assumir Conversa
                    </Button>
                </CardContent>
            </Card>
            </>
        ) : (
             <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p className="text-center">Nenhum contato selecionado</p>
            </div>
        )}
      </aside>
    </div>
  );
}

