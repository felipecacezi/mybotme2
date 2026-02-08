
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { maskCPF, maskCNPJ, maskCEP } from "@/lib/masks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const profileFormSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  documentType: z.enum(["cpf", "cnpj"]),
  document: z.string(),
  newPassword: z.string().min(8, { message: "A nova senha deve ter pelo menos 8 caracteres." }).optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
  address: z.object({
    zip: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
}).refine(data => {
    if (data.documentType === 'cpf') {
      return data.document.replace(/\D/g, '').length === 11;
    }
    return data.document.replace(/\D/g, '').length === 14;
}, {
    message: "O número do documento está incompleto.",
    path: ['document']
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As novas senhas não coincidem.",
    path: ["confirmPassword"],
});


const deleteAccountSchema = z.object({
  deletePassword: z.string().min(1, { message: "A senha é obrigatória." }),
  deleteConfirmPassword: z.string().min(1, { message: "A confirmação de senha é obrigatória." }),
}).refine(data => data.deletePassword === data.deleteConfirmPassword, {
    message: "As senhas não coincidem.",
    path: ["deleteConfirmPassword"],
});


export default function ProfilePage() {
  const { toast } = useToast();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showDeleteConfirmPassword, setShowDeleteConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: "",
      documentType: "cpf",
      document: "",
      newPassword: "",
      confirmPassword: "",
      address: {
        zip: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      }
    },
  });

  useEffect(() => {
    async function fetchProfileData() {
        try {
            const response = await fetch('/api/profile');
            const result = await response.json();

            if (response.ok && result.success) {
                const profile = result.data;
                const company = profile.company;

                const documentType = company.document_type || 'cpf';
                const documentValue = company.document || '';

                profileForm.reset({
                    email: profile.email || '',
                    documentType: documentType,
                    document: documentType === 'cpf' ? maskCPF(documentValue) : maskCNPJ(documentValue),
                    newPassword: "",
                    confirmPassword: "",
                    address: {
                        zip: company.zip_code ? maskCEP(company.zip_code) : '',
                        street: company.street || '',
                        number: company.number || '',
                        complement: company.complement || '',
                        neighborhood: company.neighborhood || '',
                        city: company.city || '',
                        state: company.state || '',
                    }
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Erro ao carregar perfil",
                    description: result.message || "Não foi possível buscar seus dados.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro de Rede",
                description: "Não foi possível conectar ao servidor para buscar seus dados.",
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  const deleteAccountForm = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      deletePassword: "",
      deleteConfirmPassword: "",
    },
    mode: "onChange"
  });

  const documentType = profileForm.watch("documentType");

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const maskedValue = documentType === 'cpf' ? maskCPF(value) : maskCNPJ(value);
    profileForm.setValue('document', maskedValue, { shouldValidate: true });
  };
  
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const maskedValue = maskCEP(value);
    profileForm.setValue('address.zip', maskedValue, { shouldValidate: true });
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        toast({ variant: "destructive", title: "Erro", description: "CEP não encontrado." });
        return;
      }
      profileForm.setValue('address.street', data.logradouro);
      profileForm.setValue('address.neighborhood', data.bairro);
      profileForm.setValue('address.city', data.localidade);
      profileForm.setValue('address.state', data.uf);
      toast({ title: "Endereço encontrado!", description: "Seu endereço foi atualizado." });
    } catch (error) {
       toast({ variant: "destructive", title: "Erro de Rede", description: "Não foi possível buscar o CEP." });
    }
  };

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true);
    try {
        const response = await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            toast({
                title: "Perfil atualizado!",
                description: "Seus dados foram salvos com sucesso.",
            });
            // Reset password fields after successful submission
            profileForm.setValue('newPassword', '');
            profileForm.setValue('confirmPassword', '');
        } else {
            throw new Error(result.message || "Não foi possível atualizar o perfil.");
        }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro na atualização",
            description: error.message,
        });
    } finally {
        setIsUpdating(false);
    }
  }

  function onDeleteAccountSubmit(values: z.infer<typeof deleteAccountSchema>) {
    console.log("Deleting account with credentials:", values);
    toast({
      variant: "destructive",
      title: "Conta excluída!",
      description: "Sua conta foi permanentemente excluída.",
    });
  }
  
  const ProfileFormSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
         <p className="text-sm font-medium text-muted-foreground pt-4">Alterar Senha (Opcional)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <p className="text-sm font-medium text-muted-foreground pt-4">Endereço da Empresa</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full md:col-span-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full md:col-span-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32 !mt-6" />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>Atualize suas informações pessoais e de endereço.</CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? <ProfileFormSkeleton /> : (
            <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="seuemail@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF ou CNPJ</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'} 
                        {...field}
                        onChange={handleDocumentChange}
                        disabled // Disabled as document type change is not implemented
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <p className="text-sm font-medium text-muted-foreground pt-4">Alterar Senha (Opcional)</p>
              
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="********" 
                            {...field}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="********"
                            {...field}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                            aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-sm font-medium text-muted-foreground pt-4">Endereço da Empresa</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="address.zip"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="00000-000" 
                            {...field} 
                            onChange={handleCepChange}
                            onBlur={handleCepBlur} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Av, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="address.number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="address.complement"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Complemento</FormLabel>
                        <FormControl>
                          <Input placeholder="Apto, Bloco, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField
                    control={profileForm.control}
                    name="address.neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={profileForm.control}
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Sua cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={profileForm.control}
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Input placeholder="UF" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              <Button type="submit" className="font-bold !mt-6" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar Alterações
              </Button>
            </form>
          </Form>
           )}
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Excluir Conta</CardTitle>
          <CardDescription>
            Esta ação é irreversível. Todos os seus dados serão permanentemente excluídos.
            Por favor, digite sua senha para confirmar a exclusão.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Tem certeza de que deseja excluir sua conta?
            </AlertDescription>
          </Alert>
          <Form {...deleteAccountForm}>
            <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccountSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={deleteAccountForm.control}
                    name="deletePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showDeletePassword ? "text" : "password"} 
                              placeholder="********" 
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowDeletePassword(!showDeletePassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                              aria-label={showDeletePassword ? "Ocultar senha" : "Mostrar senha"}
                            >
                              {showDeletePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={deleteAccountForm.control}
                    name="deleteConfirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showDeleteConfirmPassword ? 'text' : 'password'}
                              placeholder="********"
                              {...field}
                              className="pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirmPassword(!showDeleteConfirmPassword)}
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                              aria-label={showDeleteConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                              {showDeleteConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <Button 
                type="submit" 
                variant="destructive" 
                className="w-full font-bold !mt-6"
                disabled={!deleteAccountForm.formState.isValid}
              >
                Excluir Minha Conta Permanentemente
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
