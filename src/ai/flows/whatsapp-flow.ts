
'use server';

/**
 * @fileOverview A flow for simulating WhatsApp connection.
 * This flow simulates generating a QR code for pairing and monitors a fake connection status.
 *
 * - getWhatsappConnectionStatus - Gets the current connection status.
 * - generateWhatsappQrCode - Generates a QR code for connection.
 * - disconnectWhatsapp - Disconnects the current session.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import qrcode from 'qrcode';

type ConnectionState = "disconnected" | "qrcode" | "connected" | "loading" | "error";

interface AppState {
  status: ConnectionState;
  qrCodeContent: string | null;
}

const appState: AppState = {
  status: 'disconnected',
  qrCodeContent: null,
};


// == GET STATUS FLOW =========================================================

const GetStatusOutputSchema = z.object({
  status: z.enum(["disconnected", "qrcode", "connected", "loading", "error"]),
});

export async function getWhatsappConnectionStatus(): Promise<z.infer<typeof GetStatusOutputSchema>> {
    return getWhatsappConnectionStatusFlow();
}

const getWhatsappConnectionStatusFlow = ai.defineFlow(
  {
    name: 'getWhatsappConnectionStatusFlow',
    outputSchema: GetStatusOutputSchema,
  },
  async () => {
    return { status: appState.status };
  }
);


// == GENERATE QR CODE FLOW ====================================================

const GenerateQrOutputSchema = z.object({
  qrCode: z.string().optional().describe("The QR code content as a Data URL."),
});

export async function generateWhatsappQrCode(): Promise<z.infer<typeof GenerateQrOutputSchema>> {
    return generateWhatsappQrCodeFlow();
}

const generateWhatsappQrCodeFlow = ai.defineFlow(
  {
    name: 'generateWhatsappQrCodeFlow',
    outputSchema: GenerateQrOutputSchema,
  },
  async () => {
    if (appState.status === 'connected' || appState.status === 'loading') {
        return { qrCode: ''};
    }
    
    appState.status = 'loading';

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Generate a random string for the QR code to ensure it's unique each time
      const randomQrContent = `MyBotMe-Session-${Date.now()}-${Math.random()}`;
      appState.qrCodeContent = randomQrContent;
      
      const qrCodeDataUrl = await qrcode.toDataURL(appState.qrCodeContent);
      appState.status = 'qrcode';

      // Simulate user scanning the QR code and the connection being established
      setTimeout(() => {
        if (appState.status === 'qrcode') {
          appState.status = 'connected';
          appState.qrCodeContent = null;
        }
      }, 10000); // 10 seconds to "scan"

      return { qrCode: qrCodeDataUrl };
    } catch (err) {
      console.error('Failed to generate QR Code Data URL', err);
      appState.status = 'error';
      return { qrCode: '' };
    }
  }
);

// == DISCONNECT FLOW =========================================================

const DisconnectOutputSchema = z.object({
    success: z.boolean(),
});

export async function disconnectWhatsapp(): Promise<z.infer<typeof DisconnectOutputSchema>> {
    return disconnectWhatsappFlow();
}

const disconnectWhatsappFlow = ai.defineFlow(
  {
    name: 'disconnectWhatsappFlow',
    outputSchema: DisconnectOutputSchema,
  },
  async () => {
    appState.status = 'disconnected';
    appState.qrCodeContent = null;
    return { success: true };
  }
);
