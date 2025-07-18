
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ConnectionStatus = "disconnected" | "loading" | "connected" | "error";

export default function SettingsPage() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const generateQrCode = () => {
    setStatus("loading");
    setQrCodeUrl(null);
    // Simulating API call to get QR Code
    setTimeout(() => {
        const newQrCode = "https://placehold.co/256x256.png";
        setQrCodeUrl(newQrCode);
        toast({
            title: "QR Code Gerado",
            description: "Escaneie o código com o seu WhatsApp.",
        });

        // Simulate user scanning the QR code and successful connection
        setTimeout(() => {
            setStatus("connected");
            setQrCodeUrl(null);
            toast({
                title: "Conectado com Sucesso!",
                description: "Sua conta do WhatsApp foi vinculada.",
                variant: "default",
            });
        }, 10000); // 10 seconds to "scan"

    }, 2000); // 2 seconds to generate
  };
  
  const disconnect = () => {
      setStatus('disconnected');
      setQrCodeUrl(null);
       toast({
        title: "Desconectado",
        description: "Sua sessão do WhatsApp foi encerrada.",
      });
  }

  const renderStatus = () => {
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
            Aguardando Conexão...
          </Badge>
        );
       case "error":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Erro na Conexão
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
            {renderStatus()}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-6">
            {status === 'disconnected' && (
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Clique no botão abaixo para gerar um QR Code e conectar sua sessão.</p>
                    <Button onClick={generateQrCode}>Conectar ao WhatsApp</Button>
                </div>
            )}
            {status === 'loading' && (
                <div className="flex flex-col items-center space-y-4 p-8 border-dashed border-2 rounded-lg">
                    {qrCodeUrl ? (
                        <>
                            <Image src={qrCodeUrl} alt="QR Code" width={256} height={256} data-ai-hint="qr code"/>
                            <p className="text-sm text-muted-foreground text-center max-w-xs">Abra o WhatsApp no seu celular, vá em Aparelhos Conectados e escaneie o código.</p>
                        </>

                    ) : (
                         <div className="flex flex-col items-center justify-center h-64 w-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Gerando QR Code...</p>
                        </div>
                    )}
                </div>
            )}
            {status === 'connected' && (
                <div className="text-center space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                    <p className="text-lg font-medium">Sua conta está conectada!</p>
                    <p className="text-muted-foreground">Seu bot já está pronto para interagir no WhatsApp.</p>
                    <Button onClick={disconnect} variant="destructive">Desconectar</Button>
                </div>
            )}
             {status === 'error' && (
                <div className="text-center space-y-4 text-destructive">
                    <AlertTriangle className="h-16 w-16 mx-auto" />
                    <p className="text-lg font-medium">Falha na conexão</p>
                    <p>Não foi possível conectar ao WhatsApp. Por favor, tente novamente.</p>
                    <Button onClick={generateQrCode} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Tentar Novamente
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
