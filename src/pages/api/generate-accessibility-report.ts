import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@/constants/access_constants';
import { ACCESSIBILITY_REPORT_PROMPT } from '@/prompts/accessibiity_reporte_generate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { storyContent } = req.body;

  if (!storyContent) {
    return res.status(400).json({ message: 'Missing storyContent in request body' });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const geminiPrompt = ACCESSIBILITY_REPORT_PROMPT.replace('storyContent', storyContent);
    

    const result = await model.generateContent(geminiPrompt);
    const response = await result.response;
    const text = response.text();
// Attempt to parse the text as JSON
    let generatedMarkdown = text;
    const outputMatch = text.match(/<output>(.*?)<\/output>/s); // /s for multiline match
    if (outputMatch && outputMatch[1]) {
      generatedMarkdown = outputMatch[1];
    }
    res.status(200).json({ report: generatedMarkdown });
  } catch (error: any) {
    console.error('Error generating accessibility report with Gemini:', error);
    res.status(500).json({ message: 'Failed to generate accessibility report.', error: error.message });
  }
}
