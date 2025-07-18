// Use server directive.
'use server';

/**
 * @fileOverview FAQ generation flow for the MyBotMe application.
 *
 * - generateFaq - A function that generates FAQ content based on MyBotMe's information.
 * - GenerateFaqInput - The input type for the generateFaq function.
 * - GenerateFaqOutput - The return type for the generateFaq function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFaqInputSchema = z.object({
  productInformation: z
    .string()
    .describe(
      'Detailed information about the MyBotMe application, its features, and benefits.'
    ),
});
export type GenerateFaqInput = z.infer<typeof GenerateFaqInputSchema>;

const GenerateFaqOutputSchema = z.object({
  faqContent: z
    .string()
    .describe('The generated FAQ content in a readable format, such as markdown.'),
});
export type GenerateFaqOutput = z.infer<typeof GenerateFaqOutputSchema>;

export async function generateFaq(input: GenerateFaqInput): Promise<GenerateFaqOutput> {
  return generateFaqFlow(input);
}

const generateFaqPrompt = ai.definePrompt({
  name: 'generateFaqPrompt',
  input: {schema: GenerateFaqInputSchema},
  output: {schema: GenerateFaqOutputSchema},
  prompt: `You are an expert in creating helpful and informative FAQ content.

  Based on the following information about MyBotMe, generate an FAQ section that answers common questions users might have. The FAQ should be easy to read and understand.

  Product Information: {{{productInformation}}}

  FAQ:`, // Corrected the typo here
});

const generateFaqFlow = ai.defineFlow(
  {
    name: 'generateFaqFlow',
    inputSchema: GenerateFaqInputSchema,
    outputSchema: GenerateFaqOutputSchema,
  },
  async input => {
    const {output} = await generateFaqPrompt(input);
    return output!;
  }
);
