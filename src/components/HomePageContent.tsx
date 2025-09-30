import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link'; // Assuming Next.js for navigation
import { keyframes } from '@emotion/react';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

// Define keyframe animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInFromTop = keyframes`
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const backgroundPan = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HomePageContent: React.FC = () => {
  const theme = useTheme();
  const [backgroundPositionStyle, setBackgroundPositionStyle] = useState('50% 50%'); // Default static position

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (typeof window !== 'undefined') { // Ensure window is defined
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const parallaxX = (mouseX / window.innerWidth - 0.5) * 20; // Adjust sensitivity
        const parallaxY = (mouseY / window.innerHeight - 0.5) * 20; // Adjust sensitivity
        setBackgroundPositionStyle(`calc(50% + ${parallaxX}px) calc(50% + ${parallaxY}px)`);
      }
    };

    if (typeof window !== 'undefined') { // Add event listener only on client
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (typeof window !== 'undefined') { // Remove event listener only on client
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  return (
    <Box
      sx={{
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.background.default, // Use theme background
        color: theme.palette.text.primary,
        padding: theme.spacing(4),
        backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Subtle gradient background
        backgroundSize: '200% 200%', // Enable background panning
        backgroundPosition: backgroundPositionStyle, // Apply dynamic parallax
        animation: `${backgroundPan} 10s ease infinite`, // Apply background animation
        transition: 'background-position 0.1s ease-out', // Smooth parallax movement
      }}
    >
      <Container
        maxWidth="md"
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '3.5rem', sm: '4.5rem', md: '5.5rem' }, // Slightly increased font size
            color: theme.palette.primary.dark,
            marginBottom: theme.spacing(2),
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            animation: `${slideInFromTop} 0.8s ease-out forwards`, // Apply slide-in animation
          }}
        >
          Prompt Blok
        </Typography>
        <Typography
          variant="h5"
          component="p"
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: theme.spacing(4),
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, // Increased font size
          }}
        >
          Unlock the power of AI-driven content generation and accessibility analysis for your Storyblok projects.
          Prompt Blok provides intuitive tools to create components, generate story content, and ensure your digital experiences are inclusive and high-quality.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          href="/plugin" // Assuming a route for the plugin UI
          sx={{
            marginTop: theme.spacing(4),
            padding: theme.spacing(1.5, 4),
            fontSize: '1.2rem', // Slightly increased button font size
            fontWeight: 700,
            borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : theme.shape.borderRadius,
            boxShadow: theme.shadows[5],
            transition: 'transform 0.3s ease-in-out, box-shadow 0.5s ease-in-out', // Add transform to transition
            '&:hover': {
              boxShadow: theme.shadows[8],
              transform: 'scale(1.05)', // Scale up on hover
            },
          }}
        >
          Get Started
        </Button>

        {/* Feature Showcase Section */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: theme.spacing(4), // Spacing between cards
            marginTop: theme.spacing(8),
          }}
        >
          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' }, // Responsive widths
              maxWidth: { xs: '100%', sm: '45%', md: '30%' }, // Max width for responsiveness
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 3 : theme.shape.borderRadius,
              padding: theme.spacing(3),
              boxShadow: theme.shadows[3],
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <CodeIcon sx={{ fontSize: 60, color: theme.palette.primary.main, marginBottom: theme.spacing(2) }} />
            <Typography variant="h6" component="h3" fontWeight={700} marginBottom={theme.spacing(1)}>
              Component Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Effortlessly create Storyblok components with AI-powered prompts, accelerating your development workflow.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' },
              maxWidth: { xs: '100%', sm: '45%', md: '30%' },
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 3 : theme.shape.borderRadius,
              padding: theme.spacing(3),
              boxShadow: theme.shadows[3],
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <ArticleIcon sx={{ fontSize: 60, color: theme.palette.primary.main, marginBottom: theme.spacing(2) }} />
            <Typography variant="h6" component="h3" fontWeight={700} marginBottom={theme.spacing(1)}>
              Story Content Generator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate engaging and relevant story content based on your prompts, saving time and boosting creativity.
            </Typography>
          </Box>
          <Box
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 45%', md: '1 1 30%' },
              maxWidth: { xs: '100%', sm: '45%', md: '30%' },
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 3 : theme.shape.borderRadius,
              padding: theme.spacing(3),
              boxShadow: theme.shadows[3],
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: theme.shadows[6],
              },
            }}
          >
            <AccessibilityNewIcon sx={{ fontSize: 60, color: theme.palette.primary.main, marginBottom: theme.spacing(2) }} />
            <Typography variant="h6" component="h3" fontWeight={700} marginBottom={theme.spacing(1)}>
              Accessibility Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get AI-powered accessibility analysis and recommendations to ensure your content is inclusive for all users.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePageContent;
