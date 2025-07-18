
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getWhatsappConnectionStatus, generateWhatsappQrCode, disconnectWhatsapp } from "@/ai/flows/whatsapp-flow";
import { Skeleton } from "@/components/ui/skeleton";

type ConnectionStatus = "disconnected" | "loading" | "connected" | "error" | "qrcode";

export default function SettingsPage() {
  const [status, setStatus] = useState<ConnectionStatus>("loading");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const checkStatus = useCallback(async () => {
    try {
      const response = await getWhatsappConnectionStatus();
      setStatus(response.status);
      if(response.status !== 'qrcode' && response.status !== 'loading') {
        setQrCodeUrl(null);
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Erro de Comunicação",
        description: "Não foi possível verificar o status da conexão.",
      });
    }
  }, [toast]);

  // Initial status check
  useEffect(() => {
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Polling mechanism for transitional states
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (status === 'qrcode' || status === 'loading') {
       interval = setInterval(() => {
         checkStatus();
      }, 3000); // Check status every 3 seconds
    }
    return () => {
        if(interval) clearInterval(interval);
    }
  }, [status, checkStatus]);


  const handleGenerateQrCode = async () => {
    setStatus("loading");
    setQrCodeUrl(null);
    try {
      toast({
        title: "Iniciando Conexão...",
        description: "Aguarde um momento, estamos gerando o QR Code. Isso pode levar até 30 segundos.",
      });

      const response = await generateWhatsappQrCode();
      if (response.qrCode) {
        setQrCodeUrl(response.qrCode);
        setStatus("qrcode");
        toast({
          title: "QR Code Gerado",
          description: "Escaneie o código com o seu WhatsApp.",
        });
      } else {
         // This branch is hit if the flow returns an empty qrCode string.
         // We rely on the polling `checkStatus` to update to 'error' or 'connected'
         // so we don't show a premature error here. If after a while it's still
         // loading, the user will see the error state anyway.
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Erro ao Gerar QR Code",
        description: "Não foi possível gerar o código. Verifique o console para mais detalhes.",
      });
    }
  };
  
  const handleDisconnect = async () => {
      setStatus("loading");
      try {
        await disconnectWhatsapp();
        setStatus('disconnected');
        setQrCodeUrl(null);
         toast({
          title: "Desconectado",
          description: "Sua sessão do WhatsApp foi encerrada.",
        });
      } catch (error) {
         console.error(error);
         // The status check poll will eventually set the status to error or disconnected
         toast({
            variant: "destructive",
            title: "Erro ao Desconectar",
            description: "Não foi possível encerrar a sessão. Tente novamente.",
         });
      }
  }

  const renderStatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-2 h-4 w-4" />
            Conectado
          </Badge>
        );
      case "loading":
        return (
          <Badge variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando...
          </Badge>
        );
      case "qrcode":
        return (
          <Badge variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Aguardando Leitura...
          </Badge>
        );
       case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Erro
          </Badge>
        );
      case "disconnected":
      default:
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Desconectado
          </Badge>
        );
    }
  };

  const renderContent = () => {
     switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Verificando status da conexão...</p>
          </div>
        );
      case "disconnected":
        return (
          <div className="text-center space-y-4">
              <p className="text-muted-foreground">Clique no botão abaixo para gerar um QR Code e conectar sua sessão.</p>
              <Button onClick={handleGenerateQrCode}>Conectar ao WhatsApp</Button>
          </div>
        );
      case "qrcode":
         return (
             <div className="flex flex-col items-center space-y-4 p-8 border-dashed border-2 rounded-lg">
                 {qrCodeUrl ? (
                     <>
                         <Image src={qrCodeUrl} alt="QR Code para conectar WhatsApp" width={256} height={256} data-ai-hint="qr code"/>
                         <p className="text-sm text-muted-foreground text-center max-w-xs">Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código.</p>
                     </>

                 ) : (
                      <div className="flex flex-col items-center justify-center h-64 w-64">
                          <Skeleton className="h-64 w-64" />
                          <p className="mt-4 text-muted-foreground">Gerando QR Code...</p>
                     </div>
                 )}
             </div>
         );
      case "connected":
        return (
          <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <p className="text-lg font-medium">Sua conta está conectada!</p>
              <p className="text-muted-foreground">Seu bot já está pronto para interagir no WhatsApp.</p>
              <Button onClick={handleDisconnect} variant="destructive">Desconectar</Button>
          </div>
        );
      case "error":
        return (
          <div className="text-center space-y-4 text-destructive">
              <AlertTriangle className="h-16 w-16 mx-auto" />
              <p className="text-lg font-medium">Falha na conexão</p>
              <p>Não foi possível conectar ao WhatsApp. Por favor, tente novamente.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4"/>
                  Recarregar Página
              </Button>
          </div>
        );
      default:
        return null;
     }
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Conexão com WhatsApp</CardTitle>
              <CardDescription>
                Conecte sua conta do WhatsApp para ativar seu chatbot.
              </CardDescription>
            </div>
            {renderStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6 min-h-[350px]">
           {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
