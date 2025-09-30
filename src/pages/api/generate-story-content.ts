import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { STORY_GENERATE_PROMPT } from '../../prompts/story_generate';
import { GEMINI_API_KEY } from '@/constants/access_constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { storyPrompt, selectedComponents } = req.body;

  if (!storyPrompt) {
    return res.status(400).json({ message: 'Story prompt is required.' });
  }

  if (!selectedComponents || !Array.isArray(selectedComponents)) {
    return res.status(400).json({ message: 'Selected components are required and must be an array.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in .env.local');
    return res.status(500).json({ message: 'Gemini API key is not configured.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Using gemini-pro for content generation

    const componentSchemas = selectedComponents.map((comp: any) => ({
      name: comp.name,
      schema: comp.schema,
    }));

    const prompt = STORY_GENERATE_PROMPT
      .replace('{storyPrompt}', storyPrompt)
      .replace('{available_components}', JSON.stringify(componentSchemas, null, 2));

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Attempt to parse the text as JSON
    let generatedJson = text;
    const outputMatch = text.match(/<output>(.*?)<\/output>/s); // /s for multiline match
    if (outputMatch && outputMatch[1]) {
      generatedJson = outputMatch[1];
    }
    try {
      generatedJson = JSON.parse(generatedJson);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      // If parsing fails, return the raw text or an error indicating malformed JSON
      return res.status(500).json({
        message: 'Gemini generated malformed JSON. Please try again or refine your prompt.',
        rawGeminiResponse: text,
      });
    }

    res.status(200).json({ message: 'Story content generated successfully!', storyContent: generatedJson });

  } catch (error) {
    console.error('Error generating story content with Gemini:', error);
    res.status(500).json({ message: 'Failed to generate story content.', error: (error as Error).message });
  }
}
