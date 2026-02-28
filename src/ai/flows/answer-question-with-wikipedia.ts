'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerQuestionWithWikipediaInputSchema = z.object({
  question: z.string().describe('User question to answer.'),
});

const AnswerQuestionWithWikipediaOutputSchema = z.object({
  answer: z.string().describe('Factual answer to the question.'),
  sources: z.array(z.string()).describe('List of Wikipedia source URLs.'),
});

export type AnswerQuestionWithWikipediaInput =
  z.infer<typeof AnswerQuestionWithWikipediaInputSchema>;

export type AnswerQuestionWithWikipediaOutput =
  z.infer<typeof AnswerQuestionWithWikipediaOutputSchema>;

const answerQuestionWithWikipediaFlow = ai.defineFlow(
  {
    name: 'answerQuestionWithWikipedia',
    inputSchema: AnswerQuestionWithWikipediaInputSchema,
    outputSchema: AnswerQuestionWithWikipediaOutputSchema,
  },
  async ({ question }) => {
    // Search Wikipedia API
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      question
    )}`;

    try {
      const res = await fetch(searchUrl);
      const data: any = await res.json();

      if (!data.extract) {
        return {
          answer: 'No relevant Wikipedia article found.',
          sources: [],
        };
      }

      return {
        answer: data.extract,
        sources: [data.content_urls?.desktop?.page || 'https://wikipedia.org'],
      };
    } catch (error) {
      return {
        answer: 'Error fetching data from Wikipedia.',
        sources: [],
      };
    }
  }
);

export async function answerQuestionWithWikipedia(
  input: AnswerQuestionWithWikipediaInput
): Promise<AnswerQuestionWithWikipediaOutput> {
  return answerQuestionWithWikipediaFlow(input);
}