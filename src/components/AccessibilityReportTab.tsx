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
  Card,
  CardContent,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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

const STORYBLOK_TOKEN = ''; // Provided by the user

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
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Section */}
      <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            AI Accessibility Report
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Generate comprehensive accessibility reports for your Storyblok content using AI analysis.
          </Typography>

          <Accordion elevation={0} sx={{ mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="accessibility-help-content"
              id="accessibility-help-header"
              sx={{ px: 0, minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HelpOutlineIcon color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  How accessibility reporting works
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0 }}>
              <Typography variant="body2" paragraph>
                <strong>What it analyzes:</strong> Our AI examines your story content for WCAG compliance, including alt text for images, heading structure, color contrast, keyboard navigation, and semantic HTML usage.
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Report features:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ✅ <strong>Issues found:</strong> Detailed problems with specific recommendations
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  ⚠️ <strong>Warnings:</strong> Potential accessibility concerns
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  💡 <strong>Suggestions:</strong> Best practices for improvement
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  📊 <strong>Compliance score:</strong> Overall accessibility rating
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Select any published story from your space to analyze its accessibility. The AI will provide actionable insights to make your content more inclusive.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="story-select-label">Select Story to Analyze</InputLabel>
              <Select
                labelId="story-select-label"
                id="story-select"
                value={selectedStoryId}
                label="Select Story to Analyze"
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
          </Box>

          <Button
            variant="contained"
            color="info"
            onClick={handleGenerateAccessibilityReport}
            startIcon={loading ? undefined : <AssessmentIcon />}
            disabled={!selectedStoryId || loading}
            sx={{ minWidth: 160 }}
          >
            {loading ? 'Analyzing...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {/* Report Section */}
      {accessibilityReport && (
        <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Accessibility Analysis Results
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
              <Box sx={{
                '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 3, mb: 2, fontWeight: 600 },
                '& p': { mb: 2, lineHeight: 1.6 },
                '& ul, & ol': { mb: 2, pl: 3 },
                '& li': { mb: 1 },
                '& code': {
                  backgroundColor: 'grey.100',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875em'
                },
                '& pre': {
                  backgroundColor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                  overflowX: 'auto',
                  mb: 2,
                  fontSize: '0.875em'
                },
                '& blockquote': {
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  pl: 2,
                  py: 1,
                  my: 2,
                  fontStyle: 'italic',
                  backgroundColor: 'grey.50'
                },
                '& strong': { fontWeight: 600 },
                '& em': { fontStyle: 'italic' }
              }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {accessibilityReport}
                </ReactMarkdown>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* No report message */}
      {!accessibilityReport && !loading && (
        <Card elevation={1} sx={{ backgroundColor: 'grey.50' }}>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Ready to Analyze
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a story from the dropdown above and click "Generate Report" to begin the accessibility analysis.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AccessibilityReportTab;

