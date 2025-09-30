import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { lightTheme } from '@storyblok/mui'; // Import the mandatory lightTheme

// Extend the lightTheme with dark mode colors and custom typography
const customTheme = createTheme({
  ...lightTheme, // Start with the lightTheme
  typography: {
    ...lightTheme.typography, // Keep existing typography settings from lightTheme
    h1: {
      fontSize: '2.8rem', // Slightly increased
      fontWeight: 600,
    },
    h4: {
      fontSize: '2rem', // Slightly increased
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.6rem', // Slightly increased
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.3rem', // Slightly increased
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem', // Slightly increased
    },
    body2: {
      fontSize: '0.9rem', // Slightly increased
    },
    button: {
      textTransform: 'none', // Keep button text as is, not all caps
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded buttons
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8, // Rounded text fields
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          fontWeight: 'normal', // Ensure chips are not bold
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Keep tab labels as is
          fontWeight: 600, // Make tab labels a bit bolder for emphasis
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline /> {/* Resets CSS and applies basic Material-UI styles */}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
