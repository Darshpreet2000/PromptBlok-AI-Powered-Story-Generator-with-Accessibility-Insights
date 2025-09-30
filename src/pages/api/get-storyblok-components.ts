import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { spaceId, accessToken } = req.query;

  if (!spaceId) {
    return res.status(400).json({ message: 'Storyblok Space ID is required.' });
  }

  if (!accessToken || accessToken === 'temp') {
    console.warn('Using placeholder access token for Storyblok Management API. Ensure a valid token is used in production.');
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid access token.' });
  }

  try {
    const storyblokApiUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}/components/`;
    const response = await fetch(storyblokApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch components from Storyblok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    res.status(200).json({ message: 'Components fetched successfully!', components: responseData.components });

  } catch (error) {
    console.error('Error fetching components from Storyblok:', error);
    res.status(500).json({ message: 'Failed to fetch components from Storyblok.', error: (error as Error).message });
  }
}
