import { NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Define the Request Schema (Prevents malicious or empty injections)
const RequestSchema = z.object({
  question: z.string().min(2).max(100),
});

export async function POST(req: Request) {
  try {
    // Validate Input
    const body = await req.json();
    const { question } = RequestSchema.parse(body);

    // 2. Search-First MediaWiki Pipeline
    // Instead of guessing the URL, we ask Wiki for the 'Search' result first
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(question)}&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.query.search.length) {
      return NextResponse.json({ answer: "Agent could not find a relevant Wikipedia entry.", sources: [] });
    }

    // Get the top hit's title
    const bestMatchTitle = searchData.query.search[0].title;

    // 3. Fetch Full Content for the Best Match
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(bestMatchTitle)}&pithumbsize=1000&format=json&origin=*`;
    const contentRes = await fetch(contentUrl);
    const contentData = await contentRes.json();

    const pages = contentData.query.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    // 4. Structured Output Contract
    return NextResponse.json({
      answer: page.extract || "Summary unavailable.",
      sources: [`https://en.wikipedia.org/?curid=${pageId}`],
      image: page.thumbnail?.source || null,
      title: bestMatchTitle
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid query format." }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Agent Failure." }, { status: 500 });
  }
}