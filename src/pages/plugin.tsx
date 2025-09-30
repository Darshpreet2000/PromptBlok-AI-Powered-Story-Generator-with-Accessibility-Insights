import Head from 'next/head';
import SpacePluginUI from '@/components/SpacePluginUI';
import { lightTheme } from '@storyblok/mui'
import {
  ThemeProvider
} from "@mui/material";

export default function PluginPage() {
	// const { completed } = useAppBridge({ type: 'space-plugin', oauth: true });

	return (
		<>
			<Head>
				<title>Prompt Blok Plugin</title>
				<meta name="description" content="Storyblok Space Plugin with Component and Story Content Generators" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>
			<main>
				 <ThemeProvider theme={lightTheme}>
					<SpacePluginUI />
			    </ThemeProvider>
			</main>
		</>
	);
}
