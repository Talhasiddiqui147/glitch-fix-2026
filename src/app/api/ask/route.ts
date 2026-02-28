import { NextResponse } from 'next/server';
import { answerQuestionWithWikipedia } from '../../../ai/flows/answer-question-with-wikipedia';

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      );
    }

    const result = await answerQuestionWithWikipedia({ question });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}