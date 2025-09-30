import type { NextApiRequest, NextApiResponse } from 'next';
import { STORYBLOK_ACCESS_TOKEN } from '@/constants/access_constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { storyContent, spaceId } = req.body;

  if (!storyContent) {
    return res.status(400).json({ message: 'Story content is required.' });
  }

  if (!spaceId) {
    return res.status(400).json({ message: 'Space ID is required.' });
  }

  if (!STORYBLOK_ACCESS_TOKEN) {
    console.error('STORYBLOK_ACCESS_TOKEN is not set in access_constants.ts');
    return res.status(500).json({ message: 'Storyblok access token is not configured.' });
  }

  try {
    const storyblokApiUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}/stories/`;

    const storyblokResponse = await fetch(storyblokApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': STORYBLOK_ACCESS_TOKEN,
      },
      body: JSON.stringify(storyContent),
    });

    if (!storyblokResponse.ok) {
      const errorData = await storyblokResponse.json();
      console.error('Storyblok API error:', errorData);
      return res.status(storyblokResponse.status).json({
        message: errorData.error || 'Failed to publish story to Storyblok.',
        details: errorData,
      });
    }

    const data = await storyblokResponse.json();
    res.status(200).json({ message: 'Story published successfully!', story: data.story });

  } catch (error) {
    console.error('Error publishing story to Storyblok:', error);
    res.status(500).json({ message: 'Failed to publish story.', error: (error as Error).message });
  }
}
