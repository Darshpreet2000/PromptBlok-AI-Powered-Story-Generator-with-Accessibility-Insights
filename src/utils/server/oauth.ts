import { authParams } from '@/auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
	getSessionStore,
	inferSessionQuery,
} from '@storyblok/app-extension-auth';

export const getAppSession = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	// Original implementation (commented out for local development)
	/*
	const sessionStore = getSessionStore(authParams)({
		req,
		res,
	});

	const appSessionQuery = inferSessionQuery(req);
	if (!appSessionQuery) {
		return;
	}
	return await sessionStore.get(appSessionQuery);
	*/

	// For local development, return a mock session
	return {
		accessToken: 'YwQwXZNxagHqqL0s8I71Xgtt-95660423066133-mgpX2yWeHy-jE1CtGTsz',
		spaceId: '287454392109369', // Placeholder
		userId: 'mock_user_id',   // Placeholder
		expiresAt: new Date(Date.now() + 3600 * 1000 * 3).toISOString(), // Expires in 1 hour
		// Add other necessary session properties if they are used elsewhere
	};
};
