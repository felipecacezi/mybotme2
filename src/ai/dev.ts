import { config } from 'dotenv';
config();

// import '@/ai/flows/generate-faq.ts'; // This flow requires a model
import '@/ai/flows/whatsapp-flow.ts';
