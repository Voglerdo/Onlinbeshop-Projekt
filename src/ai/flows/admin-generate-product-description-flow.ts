
'use server';
/**
 * @fileOverview Ein KI-Assistent für Administratoren zur Erstellung von Produktbeschreibungen.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminGenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('Der Name des Produkts.'),
  keyFeatures: z
    .array(z.string())
    .describe('Eine Liste der Hauptmerkmale des Produkts.'),
});
export type AdminGenerateProductDescriptionInput = z.infer<
  typeof AdminGenerateProductDescriptionInputSchema
>;

const AdminGenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('Die umfassende und ansprechende Produktbeschreibung.'),
});
export type AdminGenerateProductDescriptionOutput = z.infer<
  typeof AdminGenerateProductDescriptionOutputSchema
>;

export async function adminGenerateProductDescription(
  input: AdminGenerateProductDescriptionInput
): Promise<AdminGenerateProductDescriptionOutput> {
  return adminGenerateProductDescriptionFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: AdminGenerateProductDescriptionInputSchema},
  output: {schema: AdminGenerateProductDescriptionOutputSchema},
  prompt: `Du bist ein Experten-Copywriter für einen Online-Shisha-Shop namens Blubber Baron.
Deine Aufgabe ist es, eine umfassende, ansprechende und verlockende Produktbeschreibung für ein Shisha-Produkt zu erstellen.
Hebe die Hauptmerkmale hervor und mache es für Kunden attraktiv, indem du eine anspruchsvolle und luxuriöse Sprache verwendest.
Schreibe die Antwort auf Deutsch.

Produktname: {{{productName}}}
Hauptmerkmale:{{#each keyFeatures}}
- {{{this}}}{{/each}}

Erstelle eine detaillierte Produktbeschreibung basierend auf den bereitgestellten Informationen, mit Fokus auf Luxus und Qualität.`,
});

const adminGenerateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'adminGenerateProductDescriptionFlow',
    inputSchema: AdminGenerateProductDescriptionInputSchema,
    outputSchema: AdminGenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await productDescriptionPrompt(input);
    return output!;
  }
);
