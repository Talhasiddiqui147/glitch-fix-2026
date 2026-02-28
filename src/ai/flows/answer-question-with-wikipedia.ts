'use server';

import { z } from 'genkit';

const AnswerQuestionWithWikipediaInputSchema = z.object({
  question: z.string(),
});

const AnswerQuestionWithWikipediaOutputSchema = z.object({
  answer: z.string(),
  sources: z.array(z.string()),
});

export type AnswerQuestionWithWikipediaInput =
  z.infer<typeof AnswerQuestionWithWikipediaInputSchema>;

export type AnswerQuestionWithWikipediaOutput =
  z.infer<typeof AnswerQuestionWithWikipediaOutputSchema>;

export async function answerQuestionWithWikipedia(
  input: AnswerQuestionWithWikipediaInput
): Promise<AnswerQuestionWithWikipediaOutput> {
  const { question } = input;

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&explaintext=true&titles=${encodeURIComponent(
      question
    )}&origin=*`;

    const res = await fetch(url);
    const data: any = await res.json();

    const pages = data.query?.pages;
    const page = pages ? Object.values(pages)[0] : null;

    if (!page || !page.extract) {
      return {
        answer: 'No relevant Wikipedia article found.',
        sources: [],
      };
    }

    const pageTitle = page.title;
    const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      pageTitle.replace(/ /g, '_')
    )}`;

    return {
      answer: page.extract,
      sources: [pageUrl],
    };
  } catch (error) {
    console.error(error);
    return {
      answer: 'Error fetching data from Wikipedia.',
      sources: [],
    };
  }
}