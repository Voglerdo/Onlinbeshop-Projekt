
'use server';
/**
 * @fileOverview KI-Flow zur Umwandlung der Geschichte des Barons in Sprache.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';
import wav from 'wav';

const StoryTTSInputSchema = z.object({
  text: z.string().describe('Der Philosophie-Text zum Vorlesen.'),
});

const StoryTTSOutputSchema = z.object({
  audioUri: z.string().describe('Die Daten-URI des generierten Audios.'),
});

export async function storyTTS(input: z.infer<typeof StoryTTSInputSchema>) {
  return storyTTSFlow(input);
}

const storyTTSFlow = ai.defineFlow(
  {
    name: 'storyTTSFlow',
    inputSchema: StoryTTSInputSchema,
    outputSchema: StoryTTSOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: `Lies die folgende Philosophie mit einem anspruchsvollen, ruhigen und autoritären Ton auf DEUTSCH vor: ${input.text}`,
    });

    if (!media) {
      throw new Error('Kein Audio zurückgegeben');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      audioUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
