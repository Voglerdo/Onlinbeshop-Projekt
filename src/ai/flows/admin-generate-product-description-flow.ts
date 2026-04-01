'use server';
/**
 * @fileOverview An AI assistant for administrators to generate product descriptions.
 *
 * - adminGenerateProductDescription - A function that handles the generation of product descriptions.
 * - AdminGenerateProductDescriptionInput - The input type for the adminGenerateProductDescription function.
 * - AdminGenerateProductDescriptionOutput - The return type for the adminGenerateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminGenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  keyFeatures: z
    .array(z.string())
    .describe('A list of key features for the product.'),
});
export type AdminGenerateProductDescriptionInput = z.infer<
  typeof AdminGenerateProductDescriptionInputSchema
>;

const AdminGenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The comprehensive and engaging product description.'),
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
  prompt: `You are an expert copywriter for an online shisha shop called Crimson Coals.
Your task is to generate a comprehensive, engaging, and enticing product description for a shisha product.
Highlight the key features and make it appealing to customers, using sophisticated and luxurious language.

Product Name: {{{productName}}}
Key Features:{{#each keyFeatures}}
- {{{this}}}{{/each}}

Generate a detailed product description based on the information provided, focusing on luxury and quality.`,
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
