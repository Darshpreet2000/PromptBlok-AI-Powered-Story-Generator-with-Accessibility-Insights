import { handleConnect } from '@/auth';

export const config = {
	api: {
		externalResolver: true,
	},
};

export const dynamic = 'force-dynamic'; // Add this line

export default handleConnect;
