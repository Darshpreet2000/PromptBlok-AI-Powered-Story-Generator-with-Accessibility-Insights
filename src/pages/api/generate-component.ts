import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { componentGeneratePrompt } from '@prompts/component_generate';
import { GEMINI_API_KEY } from '@/constants/access_constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt: userPrompt, geminiModel } = req.body; // accessToken is no longer passed directly to this API

  if (!userPrompt) {
    return res.status(400).json({ message: 'Prompt is required.' });
  }
  if (!geminiModel) {
    return res.status(400).json({ message: 'Gemini model name is required.' });
  }

  const geminiApiKey = GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error('GEMINI_API_KEY is not set in .env.local');
    return res.status(500).json({ message: 'Server configuration error: Gemini API Key is missing.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: geminiModel });

    // Craft a detailed prompt for Gemini to generate a Storyblok component schema
    const geminiPrompt = componentGeneratePrompt.replace('userPrompt', userPrompt);

    const result = await model.generateContent(geminiPrompt);
    const response = await result.response;
    const generatedText = response.text(); // Use .text() for GoogleGenerativeAI SDK

    if (!generatedText) {
      return res.status(500).json({ message: 'Failed to generate component schema from Gemini (no text in response).' });
    }

    let jsonString = generatedText;
    const outputMatch = generatedText.match(/<output>(.*?)<\/output>/s); // /s for multiline match
    if (outputMatch && outputMatch[1]) {
      jsonString = outputMatch[1];
    }

    // Attempt to parse the generated text as JSON
    let componentSchema;
    try {
      componentSchema = JSON.parse(jsonString); // Parse the extracted content
      console.log('Generated component schema:', componentSchema);
    } catch (jsonError) {
      console.error('Failed to parse Gemini response as JSON:', jsonError);
      return res.status(500).json({ message: 'Gemini generated invalid JSON.', rawResponse: generatedText });
    }

    res.status(200).json(componentSchema);

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ message: 'Failed to generate component.', error: (error as Error).message });
  }
}
