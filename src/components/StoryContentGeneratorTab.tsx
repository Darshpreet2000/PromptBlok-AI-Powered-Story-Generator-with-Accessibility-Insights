import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PublishIcon from '@mui/icons-material/Publish';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme } from '@mui/material/styles';
import { STORYBLOK_ACCESS_TOKEN } from '@/constants/access_constants';

interface StoryContentGeneratorTabProps {
  storyPrompt: string;
  setStoryPrompt: (prompt: string) => void;
  generatedStoryContent: string;
  setGeneratedStoryContent: (content: string) => void;
  spaceId: string; // Add spaceId prop
}

const StoryContentGeneratorTab: React.FC<StoryContentGeneratorTabProps> = ({
  storyPrompt,
  setStoryPrompt,
  generatedStoryContent,
  setGeneratedStoryContent,
  spaceId, // Destructure spaceId
}) => {
  const theme = useTheme(); // Initialize theme
  const [availableComponents, setAvailableComponents] = useState<any[]>([]);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [componentsError, setComponentsError] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyGenerationError, setStoryGenerationError] = useState<string | null>(null);
  const [isPublishingStory, setIsPublishingStory] = useState(false);
  const [storyPublishError, setStoryPublishError] = useState<string | null>(null);
  const [storyPublishSuccess, setStoryPublishSuccess] = useState<string | null>(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedStoryContent);
    // Optionally, show a temporary success message
  };

  useEffect(() => {
    const fetchComponents = async () => {
      if (!spaceId) {
        setAvailableComponents([]);
        return;
      }

      setIsLoadingComponents(true);
      setComponentsError(null);

      try {
        const response = await fetch(`/api/get-storyblok-components?spaceId=${spaceId}&accessToken=${STORYBLOK_ACCESS_TOKEN}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch components.');
        }
        const data = await response.json();
        setAvailableComponents(data.components);
      } catch (err) {
        setComponentsError((err as Error).message);
      } finally {
        setIsLoadingComponents(false);
      }
    };

    fetchComponents();
  }, [spaceId]);

  const handleGenerateStoryContent = async () => {
    setIsGeneratingStory(true);
    setStoryGenerationError(null);
    setGeneratedStoryContent('// Generating story content...');

    try {
      const componentsToPass = availableComponents;

      const response = await fetch('/api/generate-story-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyPrompt,
          selectedComponents: componentsToPass,
          geminiModel: 'gemini-2.0-flash', // Or another model if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate story content.');
      }

      const data = await response.json();
      setGeneratedStoryContent(JSON.stringify(data.storyContent, null, 2));
    } catch (err) {
      setStoryGenerationError((err as Error).message);
      setGeneratedStoryContent('// Error generating story content.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const handlePublishStoryContent = async () => {
    setIsPublishingStory(true);
    setStoryPublishError(null);
    setStoryPublishSuccess(null);

    try {
      if (!generatedStoryContent) {
        throw new Error('No story content generated to publish.');
      }

      let parsedStoryContent;
      try {
        parsedStoryContent = JSON.parse(generatedStoryContent);
      } catch (parseError) {
        throw new Error('Generated story content is not valid JSON.');
      }

      const response = await fetch('/api/publish-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyContent: parsedStoryContent,
          spaceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish story.');
      }

      const data = await response.json();
      setStoryPublishSuccess(`Story "${data.story.name}" published successfully!`);
      // Optionally, clear generated content or update UI further
    } catch (err) {
      setStoryPublishError((err as Error).message);
    } finally {
      setIsPublishingStory(false);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Section */}
      <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Story Content Generator
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Generate complete Storyblok stories by combining your available components with AI.
          </Typography>

          <Accordion elevation={0} sx={{ mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="story-help-content"
              id="story-help-header"
              sx={{ px: 0, minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HelpOutlineIcon color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  How to use Story Content Generator
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0 }}>
              <Typography variant="body2" paragraph>
                <strong>What it does:</strong> This AI tool analyzes your available Storyblok components and generates complete story content that uses them effectively. It creates structured content with proper component references.
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Tips for better results:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Describe the page type and content structure you want
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Mention specific components you want to include
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Include content themes or target audience information
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Specify the story name or slug if desired
                </Typography>
              </Box>

              <Typography variant="body2" paragraph>
                <strong>Example prompts:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  label="Create a homepage with hero, features, and testimonials sections"
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setStoryPrompt('Create a homepage with hero, features, and testimonials sections')}
                />
                <Chip
                  label="Build an about page with team members and company values"
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setStoryPrompt('Build an about page with team members and company values')}
                />
                <Chip
                  label="Design a services page showcasing our offerings"
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setStoryPrompt('Design a services page showcasing our offerings')}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                The generated content will automatically use your available components and can be published directly to your space.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Components Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Available Components
            </Typography>
            {isLoadingComponents && <CircularProgress size={24} />}
            {componentsError && <Alert severity="error">{componentsError}</Alert>}
            {!isLoadingComponents && availableComponents.length === 0 && !componentsError && (
              <Alert severity="info">No components found. Please ensure a valid Space ID is configured in settings.</Alert>
            )}
            {!isLoadingComponents && availableComponents.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {availableComponents.map((component) => (
                  <Chip
                    key={component.id}
                    label={component.name}
                    variant="filled"
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Box>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <TextField
            label="Story Prompt"
            multiline
            rows={5}
            value={storyPrompt}
            onChange={(e) => setStoryPrompt(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={isGeneratingStory}
            sx={{ maxWidth: 800, width: '100%' }}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerateStoryContent}
              disabled={isGeneratingStory || !storyPrompt.trim() || availableComponents.length === 0}
              startIcon={isGeneratingStory ? <CircularProgress size={20} color="inherit" /> : <AutoStoriesIcon />}
              sx={{ minWidth: 180 }}
            >
              {isGeneratingStory ? 'Generating...' : 'Generate Story'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePublishStoryContent}
              disabled={isGeneratingStory || isPublishingStory || !generatedStoryContent.trim()}
              startIcon={isPublishingStory ? <CircularProgress size={20} color="inherit" /> : <PublishIcon />}
              sx={{ minWidth: 180 }}
            >
              {isPublishingStory ? 'Publishing...' : 'Publish Story'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(storyGenerationError || storyPublishError || storyPublishSuccess) && (
        <Box>
          {storyGenerationError && <Alert severity="error">{storyGenerationError}</Alert>}
          {storyPublishError && <Alert severity="error">{storyPublishError}</Alert>}
          {storyPublishSuccess && <Alert severity="success">{storyPublishSuccess}</Alert>}
        </Box>
      )}

      {/* Results Section */}
      {generatedStoryContent !== '// Generating story content...' && generatedStoryContent !== '// Error generating story content.' && (
        <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Generated Story JSON
              </Typography>
              <Tooltip title="Copy to Clipboard">
                <IconButton onClick={handleCopyToClipboard} aria-label="copy to clipboard" size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{
                backgroundColor: '#272727',
                color: '#f8f8f8',
                padding: theme.spacing(2),
                borderRadius: theme.shape.borderRadius,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                border: '1px solid #ddd',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              {generatedStoryContent}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default StoryContentGeneratorTab;
