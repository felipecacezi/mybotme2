
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import React, { useState, useMemo } from "react";

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
import { Info, Plus, Trash2, Pencil, BotMessageSquare, GripVertical, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const chatbotSettingsSchema = z.object({
  context: z.string().min(10, {
    message: "O contexto deve ter pelo menos 10 caracteres.",
  }).max(4000, {
      message: "O contexto não pode exceder 4000 caracteres."
  }),
});

// --- Nova Estrutura para o Chatbot Comum ---

const flowNodeOptionSchema = z.object({
  text: z.string().min(1, "O texto da opção não pode estar vazio."),
  nextId: z.string().min(1, "Selecione a próxima mensagem."),
});

const flowNodeSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "A mensagem não pode estar vazia."),
  isStartNode: z.boolean().optional(),
  options: z.array(flowNodeOptionSchema).optional(),
});

type FlowNode = z.infer<typeof flowNodeSchema>;

// Mock de dados iniciais com a nova estrutura
const initialFlowNodes: FlowNode[] = [
  {
    id: "start",
    text: "Olá! Bem-vindo à nossa barbearia. Como posso ajudar?",
    isStartNode: true,
    options: [
      { text: "Agendar Horário", nextId: "agendar" },
      { text: "Ver Serviços", nextId: "servicos" },
      { text: "Falar com Atendente", nextId: "atendente" },
    ],
  },
  {
    id: "agendar",
    text: "Ótimo! Para qual dia você gostaria de agendar?",
    options: [],
  },
  {
    id: "servicos",
    text: "Oferecemos Corte (R$50), Barba (R$40) e Combo (R$80).",
    options: [
        { text: "Voltar ao início", nextId: "start"},
    ],
  },
   {
    id: "atendente",
    text: "Ok, estou transferindo para um de nossos atendentes. Por favor, aguarde.",
    options: [],
  },
];


export default function ChatbotSettingsPage() {
  const { toast } = useToast();
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>(initialFlowNodes);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const aiForm = useForm<z.infer<typeof chatbotSettingsSchema>>({
    resolver: zodResolver(chatbotSettingsSchema),
    defaultValues: {
      context: "Você é uma secretária virtual para uma empresa de agendamentos. Seu nome é MIA (MyBotMe Intelligent Assistant). Você deve ser amigável, profissional e eficiente. Seu objetivo principal é ajudar os clientes a agendar, reagendar ou cancelar compromissos. Sempre confirme os detalhes do agendamento com o cliente antes de finalizar. Não faça piadas nem use uma linguagem excessivamente informal.",
    },
  });

  const flowForm = useForm<FlowNode>({
    resolver: zodResolver(flowNodeSchema),
    defaultValues: {
      id: "",
      text: "",
      options: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: flowForm.control,
    name: "options",
  });

  const startNode = useMemo(() => flowNodes.find(n => n.isStartNode), [flowNodes]);

  function onAiSubmit(values: z.infer<typeof chatbotSettingsSchema>) {
    console.log("Chatbot Context:", values);
    toast({
      title: "Configurações de I.A. Salvas!",
      description: "O contexto do seu chatbot foi atualizado com sucesso.",
    });
  }

  function handleEditNode(node: FlowNode) {
    setEditingNodeId(node.id);
    flowForm.reset({
      id: node.id,
      text: node.text,
      options: node.options || [],
      isStartNode: node.isStartNode,
    });
  }

  function handleCancelEdit() {
    setEditingNodeId(null);
    flowForm.reset({ id: "", text: "", options: [] });
  }

  function onFlowNodeSubmit(values: FlowNode) {
    if (editingNodeId) {
      // Edit
      setFlowNodes(prev => prev.map(node => node.id === editingNodeId ? values : node));
      toast({ title: "Mensagem Atualizada!" });
    } else {
      // Add
      const newNode: FlowNode = { ...values, id: `node_${Date.now()}` };
      setFlowNodes(prev => [...prev, newNode]);
      toast({ title: "Mensagem Adicionada!" });
    }
    handleCancelEdit();
  }

  function handleDeleteNode(idToDelete: string) {
    setFlowNodes(prev => {
      // Prevent deleting the start node
      const nodeToDelete = prev.find(n => n.id === idToDelete);
      if (nodeToDelete?.isStartNode) {
        toast({ variant: "destructive", title: "Ação não permitida", description: "Não é possível excluir a mensagem inicial." });
        return prev;
      }
      // Remove node and update any options pointing to it
      const newNodes = prev
        .filter(n => n.id !== idToDelete)
        .map(n => ({
          ...n,
          options: n.options?.filter(opt => opt.nextId !== idToDelete),
        }));
      
      toast({ variant: "destructive", title: "Mensagem Removida" });
      return newNodes;
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
            Crie um fluxo de mensagens interativas com opções para guiar o usuário.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...flowForm}>
              <form onSubmit={flowForm.handleSubmit(onFlowNodeSubmit)} className="space-y-6 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold">{editingNodeId ? "Editando Mensagem" : "Adicionar Nova Mensagem"}</h3>
                <FormField
                  control={flowForm.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto da Mensagem do Bot</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Digite a mensagem do bot..." {...field} className="bg-background"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <FormLabel>Opções de Resposta (Botões)</FormLabel>
                   {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2 p-2 border rounded-md bg-background">
                       <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow">
                             <FormField
                                control={flowForm.control}
                                name={`options.${index}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Texto do Botão</FormLabel>
                                        <FormControl><Input placeholder="Ex: Agendar" {...field} /></FormControl>
                                         <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={flowForm.control}
                                name={`options.${index}.nextId`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Próxima Mensagem</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {flowNodes.filter(n => !n.isStartNode || n.id === 'start').map(node => (
                                                    <SelectItem key={node.id} value={node.id}>
                                                        {node.isStartNode ? "(Início) " : ""}{node.text.substring(0, 40)}...
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "", nextId: "" })}>
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Opção
                  </Button>
                </div>

                <div className="flex justify-end gap-2">
                    {editingNodeId && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancelar Edição</Button>
                    )}
                    <Button type="submit" className="font-bold">
                        {editingNodeId ? "Salvar Mensagem" : "Adicionar Mensagem ao Fluxo"}
                    </Button>
                </div>
              </form>
            </Form>

            <Separator className="my-8"/>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Visualização do Fluxo</h3>
                {flowNodes.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">Nenhuma mensagem cadastrada. Adicione uma acima para começar.</p>
                ) : (
                    <div className="space-y-4">
                        {flowNodes.map(node => (
                            <Card key={node.id} className={cn(node.isStartNode && "border-primary border-2")}>
                                <CardHeader className="flex-row items-start gap-4 space-y-0 p-4">
                                     <div className="flex-shrink-0 flex items-center gap-2">
                                        <BotMessageSquare className="h-6 w-6 text-primary"/>
                                    </div>
                                    <div className="flex-grow">
                                        <CardTitle className="text-base font-normal">{node.text}</CardTitle>
                                        {node.isStartNode && <CardDescription className="text-xs text-primary font-semibold mt-1">MENSAGEM INICIAL</CardDescription>}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditNode(node)}>
                                            <Pencil className="h-4 w-4"/>
                                            <span className="sr-only">Editar</span>
                                        </Button>
                                        {!node.isStartNode && <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteNode(node.id)}>
                                            <Trash2 className="h-4 w-4"/>
                                            <span className="sr-only">Excluir</span>
                                        </Button>}
                                    </div>
                                </CardHeader>
                                {node.options && node.options.length > 0 && (
                                    <CardContent className="p-4 pt-0 pl-14">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold text-muted-foreground">OPÇÕES DE RESPOSTA:</p>
                                            {node.options.map((opt, index) => {
                                                const nextNode = flowNodes.find(n => n.id === opt.nextId);
                                                return (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    <Button variant="outline" size="sm" className="pointer-events-none">{opt.text}</Button>
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                                                    <span className="text-muted-foreground text-xs italic truncate">
                                                       {nextNode ? `Leva para: "${nextNode.text}"` : "Link quebrado"}
                                                    </span>
                                                </div>
                                            )})}
                                        </div>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    