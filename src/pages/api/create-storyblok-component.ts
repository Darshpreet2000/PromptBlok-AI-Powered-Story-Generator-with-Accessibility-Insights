import type { NextApiRequest, NextApiResponse } from 'next';
import { getAppSession } from '@/utils/server/oauth'; // Assuming getAppSession provides necessary info

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { component: componentSchema, accessToken, spaceId } = req.body; // Assuming componentSchema, accessToken, and spaceId are passed from frontend

  if (!componentSchema) {
    return res.status(400).json({ message: 'Component schema is required.' });
  }

  if (!spaceId) {
    return res.status(400).json({ message: 'Storyblok Space ID is required.' });
  }

  // In a real scenario, you'd validate the accessToken and potentially retrieve it from session
  // For now, we'll use the passed accessToken (which is 'temp' from our mock)
  if (!accessToken || accessToken === 'temp') {
    console.warn('Using placeholder access token for Storyblok Management API. Ensure a valid token is used in production.');
    // You might want to return an error or use a default behavior if the token is not valid
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid access token.' });
  }

  try {
    // Make a direct POST request to the Storyblok Management API
    const storyblokApiUrl = `https://mapi.storyblok.com/v1/spaces/${spaceId}/components/`;
    const response = await fetch(storyblokApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${accessToken}`,
      },
      body: JSON.stringify({ component: componentSchema }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to create component in Storyblok. Status: ${response.status}`);
    }

    const responseData = await response.json();
    res.status(200).json({ message: 'Component created successfully!', component: responseData });

  } catch (error) {
    console.error('Error creating component in Storyblok:', error);
    res.status(500).json({ message: 'Failed to create component in Storyblok.', error: (error as Error).message });
  }
}
