'use server';

import { z } from 'genkit';

const InputSchema = z.object({
  question: z.string(),
});

const OutputSchema = z.object({
  title: z.string(),
  answer: z.string(),
  sources: z.array(z.string()),
  image: z.string().nullable(),
});

export type AnswerQuestionWithWikipediaInput = z.infer<typeof InputSchema>;
export type AnswerQuestionWithWikipediaOutput = z.infer<typeof OutputSchema>;

export async function answerQuestionWithWikipedia(
  input: AnswerQuestionWithWikipediaInput
): Promise<AnswerQuestionWithWikipediaOutput> {
  const { question } = input;

  try {
    // STEP 1: Search Wikipedia
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${encodeURIComponent(
      question
    )}&origin=*`;

    const searchRes = await fetch(searchUrl);
    const searchData: any = await searchRes.json();

    if (!searchData.query?.search?.length) {
      return {
        title: 'No Results',
        answer: 'No relevant Wikipedia article found.',
        sources: [],
        image: null,
      };
    }

    const bestMatch = searchData.query.search[0].title;

    // STEP 2: Fetch extract + image
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&explaintext=true&pithumbsize=400&titles=${encodeURIComponent(
      bestMatch
    )}&origin=*`;

    const extractRes = await fetch(extractUrl);
    const extractData: any = await extractRes.json();

    const pages = extractData.query.pages;
    const page = Object.values(pages)[0] as any;

    const pageUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
      bestMatch.replace(/ /g, '_')
    )}`;

    return {
      title: bestMatch,
      answer: page.extract?.slice(0, 1200) || 'No extract available.',
      sources: [pageUrl],
      image: page.thumbnail?.source || null,
    };
  } catch (error) {
    console.error(error);

    return {
      title: 'Error',
      answer: 'Error fetching data from Wikipedia.',
      sources: [],
      image: null,
    };
  }
}