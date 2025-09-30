import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  border: '1px solid #eee',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

interface AccessibilityReportTabProps {
  accessibilityReport: string;
  setAccessibilityReport: (report: string) => void;
}

interface Story {
  id: string;
  name: string;
  full_slug: string;
  content: any;
}

const STORYBLOK_TOKEN = 'zXV6V1kqEGMqRrhhBZMtKwtt'; // Provided by the user

const AccessibilityReportTab: React.FC<AccessibilityReportTabProps> = ({
  accessibilityReport,
  setAccessibilityReport,
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.storyblok.com/v2/cdn/stories?token=${STORYBLOK_TOKEN}&version=published`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStories(data.stories);
      } catch (error) {
        console.error('Error fetching stories from Storyblok:', error);
        // Fallback to mock data if API fails
        setStories([
          { id: '1', name: 'Homepage (Mock)', full_slug: 'homepage-mock', content: { component: 'page', body: '<h1>Welcome to our site!</h1><img src="hero.jpg" alt="" />' } },
          { id: '2', name: 'About Us (Mock)', full_slug: 'about-us-mock', content: { component: 'page', body: '<h2>About Us</h2><p>We are a company that does things.</p>' } },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleGenerateAccessibilityReport = async () => {
    if (!selectedStoryId) {
      alert('Please select a story first.');
      return;
    }

    setLoading(true);
    console.log('Generating accessibility report for story:', selectedStoryId);

    const selectedStory = stories.find(story => story.id === selectedStoryId);
    if (!selectedStory) {
      alert('Selected story not found.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-accessibility-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyContent: JSON.stringify(selectedStory.content) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAccessibilityReport(data.report);
    } catch (error: any) {
      console.error('Error generating accessibility report:', error);
      setAccessibilityReport(`Error generating report: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledSection>
      <Typography variant="h5" component="h2" gutterBottom>
        AI Accessibility Report
      </Typography>
      <Typography variant="body1" paragraph>
        Generate an AI-powered accessibility report for your content.
      </Typography>

      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <InputLabel id="story-select-label">Select Story</InputLabel>
        <Select
          labelId="story-select-label"
          id="story-select"
          value={selectedStoryId}
          label="Select Story"
          onChange={(e) => setSelectedStoryId(e.target.value as string)}
          disabled={loading}
        >
          {stories.map((story) => (
            <MenuItem key={story.id} value={story.id}>
              {story.name} ({story.full_slug})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="info"
        onClick={handleGenerateAccessibilityReport}
        sx={{ mt: 2 }}
        disabled={!selectedStoryId || loading}
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </Button>
      <Box sx={{ mt: 4, borderTop: '1px solid #eee', paddingTop: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Report Details
        </Typography>
        {accessibilityReport ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {accessibilityReport}
          </ReactMarkdown>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Select a story and click "Generate Report" to see the accessibility report here.
          </Typography>
        )}
      </Box>
    </StyledSection>
  );
};

export default AccessibilityReportTab;
