
'use server';

/**
 * @fileOverview A flow for managing WhatsApp connection using whatsapp-web.js.
 * This flow initializes a real WhatsApp client, generates a QR code for pairing,
 * and monitors the connection status.
 *
 * - getWhatsappConnectionStatus - Gets the current connection status.
 * - generateWhatsappQrCode - Generates a QR code for connection.
 * - disconnectWhatsapp - Disconnects the current session.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode';

// This is a simplified in-memory store. In a real app, you'd use a database.
type ConnectionState = "disconnected" | "qrcode" | "connected" | "loading" | "error";

interface AppState {
  client: Client | null;
  status: ConnectionState;
  qrCode: string | null;
}

// Global state for our WhatsApp client instance.
// This is not suitable for production but works for this serverless prototype context.
const appState: AppState = {
  client: null,
  status: 'disconnected',
  qrCode: null,
};


function initializeClient() {
    if (appState.client) {
        return appState.client;
    }

    console.log('Initializing WhatsApp client...');
    appState.status = 'loading'; // Set status to loading immediately

    const client = new Client({
        authStrategy: new LocalAuth(), // This will save session data to .wwebjs_auth/ folder
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for many cloud environments
        }
    });

    client.on('qr', (qr) => {
        console.log('QR Code received');
        appState.qrCode = qr;
        appState.status = 'qrcode';
    });

    client.on('ready', () => {
        console.log('WhatsApp client is ready!');
        appState.status = 'connected';
        appState.qrCode = null;
    });

    client.on('disconnected', (reason) => {
        console.log('WhatsApp client disconnected.', reason);
        appState.status = 'disconnected';
        if (appState.client) {
           appState.client.destroy();
           appState.client = null;
        }
    });
    
    client.on('auth_failure', (msg) => {
        console.error('Authentication failure', msg);
        appState.status = 'error';
        if (appState.client) {
           appState.client.destroy();
           appState.client = null;
        }
    });

    client.initialize().catch(err => {
        console.error("Failed to initialize client:", err);
        appState.status = 'error';
    });
    
    appState.client = client;
    return client;
}


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
    // If there's no client and we are not in a loading state, we are disconnected.
    if (!appState.client && appState.status !== 'loading') {
      appState.status = 'disconnected';
    }
    return { status: appState.status };
  }
);


// == GENERATE QR CODE FLOW ====================================================

const GenerateQrOutputSchema = z.object({
  qrCode: z.string().optional().describe("The QR code content provided by whatsapp-web.js as a Data URL."),
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

    initializeClient();

    // The 'qr' event is asynchronous. We wait for it to be set.
    for (let i = 0; i < 15; i++) { // Wait up to 15 seconds
      if (appState.status === 'qrcode' && appState.qrCode) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (appState.status === 'qrcode' && appState.qrCode) {
        try {
            const qrCodeDataUrl = await qrcode.toDataURL(appState.qrCode);
            return { qrCode: qrCodeDataUrl };
        } catch (err) {
            console.error('Failed to convert QR content to Data URL', err);
            appState.status = 'error';
            return { qrCode: '' };
        }
    }

    // If we reach here, QR code was not generated in time.
    if (appState.status !== 'connected') {
      appState.status = 'error';
    }
    return { qrCode: '' };
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
    if (appState.client) {
        try {
            await appState.client.logout(); // Use logout for proper session termination
            console.log('Successfully logged out.');
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            // In any case, destroy the client and reset state
            if (appState.client) {
              await appState.client.destroy();
            }
            appState.client = null;
            appState.status = 'disconnected';
            appState.qrCode = null;
        }
    } else {
        // If there's no client object, we are already disconnected.
        appState.status = 'disconnected';
    }
    return { success: true };
  }
);
