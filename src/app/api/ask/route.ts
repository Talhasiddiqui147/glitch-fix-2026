import { NextResponse } from 'next/server';
import { answerQuestionWithWikipedia } from '../../../ai/flows/answer-question-with-wikipedia';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input existence and type
    if (!body.question || typeof body.question !== 'string') {
      return NextResponse.json(
        { error: 'Invalid question input.' },
        { status: 400 }
      );
    }

    const result = await answerQuestionWithWikipedia({
      question: body.question.trim(),
    });

    // Validate response contract
    if (!result || !result.answer) {
      return NextResponse.json(
        { error: 'Invalid response from AI layer.' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API Route Error:', error);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    );
  }
}