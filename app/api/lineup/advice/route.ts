import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { roster, scoringSettings, opponent, risk } = body;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const systemPrompt = `You are a fantasy football assistant. Given a roster, league scoring settings, and an opponent lineup, recommend the best starting lineup. Cite which stats you used and list top 3 uncertainties. Provide a concise action plan.`;
    const userPrompt = JSON.stringify({ roster, scoringSettings, opponent, risk });
    const result = await model.generateContent({
      contents: [
        { role: 'system', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: userPrompt }] },
      ],
    });
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return NextResponse.json({ advice: responseText });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error generating advice' }, { status: 500 });
  }
}
