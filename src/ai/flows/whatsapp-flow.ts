
'use server';

/**
 * @fileOverview A mock flow for managing WhatsApp connection.
 * This is a simulation and does not connect to the actual WhatsApp service.
 *
 * - getWhatsappConnectionStatus - Gets the current connection status.
 * - generateWhatsappQrCode - Generates a mock QR code for connection.
 * - disconnectWhatsapp - Disconnects the current session.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// In-memory state simulation (would be a database in a real app)
let connectionState: 'disconnected' | 'qrcode' | 'connected' = 'disconnected';
let lastQrCodeRequestTime: number | null = null;


// == GET STATUS FLOW =========================================================

const GetStatusOutputSchema = z.object({
  status: z.enum(["disconnected", "qrcode", "connected", "loading"]),
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
    // Simulate the user "scanning" the QR code after some time
    if (connectionState === 'qrcode' && lastQrCodeRequestTime) {
      const timeSinceQrRequest = Date.now() - lastQrCodeRequestTime;
      if (timeSinceQrRequest > 10000) { // 10 seconds
        connectionState = 'connected';
        lastQrCodeRequestTime = null; // Reset timer
      }
    }
    return { status: connectionState };
  }
);


// == GENERATE QR CODE FLOW ====================================================

const GenerateQrOutputSchema = z.object({
  qrCode: z.string().optional().describe("The QR code image as a data URI or URL."),
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
    connectionState = 'qrcode';
    lastQrCodeRequestTime = Date.now();
    // In a real implementation, you would generate a real QR code here.
    // We are using a placeholder for this prototype.
    return {
        qrCode: 'https://placehold.co/256x256.png'
    };
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
    connectionState = 'disconnected';
    lastQrCodeRequestTime = null;
    return { success: true };
  }
);
