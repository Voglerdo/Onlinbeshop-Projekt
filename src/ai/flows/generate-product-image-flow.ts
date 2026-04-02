
'use server';
/**
 * @fileOverview AI flow to generate luxury product images for Blubber Baron.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the shisha product.'),
  description: z.string().describe('A brief description of the product style.'),
});

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});

export async function generateProductImage(input: z.infer<typeof GenerateProductImageInputSchema>) {
  return generateProductImageFlow(input);
}

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A professional, high-end commercial product photograph of ${input.productName}. ${input.description}. 
      The style is luxurious, cinematic lighting, shallow depth of field, 8k resolution, minimalist background, 
      focus on premium materials like glass, gold, and polished steel. No text or logos.`,
    });

    if (!media) {
      throw new Error('Failed to generate image');
    }

    return {
      imageUrl: media.url,
    };
  }
);
