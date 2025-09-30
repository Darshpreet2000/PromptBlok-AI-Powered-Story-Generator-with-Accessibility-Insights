import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton, // Added IconButton for copy functionality
  Tooltip, // Added Tooltip for copy functionality
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Added copy icon
import { useTheme } from '@mui/material/styles'; // Import useTheme
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
    <Box
      sx={{
        marginBottom: theme.spacing(4),
        border: '1px solid #eee',
        padding: theme.spacing(3),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Story Content Generator
      </Typography>
      <Typography variant="body1" paragraph>
        Fetch existing components and generate story content based on a prompt.
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Available Storyblok Components
        </Typography>
        {isLoadingComponents && <CircularProgress size={24} />}
        {componentsError && <Alert severity="error">{componentsError}</Alert>}
        {!isLoadingComponents && availableComponents.length === 0 && !componentsError && (
          <Alert severity="info">No components found. Please ensure a valid Space ID is entered.</Alert>
        )}
        {!isLoadingComponents && availableComponents.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2, mb: 3 }}>
            {availableComponents.map((component) => (
              <Chip
                key={component.id}
                label={component.name}
                variant="outlined"
                color="primary"
                sx={{ '& .MuiChip-label': { fontWeight: 'normal' } }} // Make chip label non-bold
              />
            ))}
          </Box>
        )}
      </Box>

      <TextField
        label="Story Prompt"
        multiline
        rows={5}
        fullWidth
        value={storyPrompt}
        onChange={(e) => setStoryPrompt(e.target.value)}
        margin="normal"
        variant="outlined"
        disabled={isGeneratingStory}
      />
      <Box sx={{ mt: 3, mb: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateStoryContent}
          disabled={isGeneratingStory || !storyPrompt.trim() || availableComponents.length === 0}
          startIcon={isGeneratingStory ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Generate Story Content
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePublishStoryContent}
          disabled={isGeneratingStory || isPublishingStory || !generatedStoryContent.trim()}
          startIcon={isPublishingStory ? <CircularProgress size={20} color="inherit" /> : null}
        >
          Publish Story Content
        </Button>
      </Box>
      {storyGenerationError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {storyGenerationError}
        </Alert>
      )}
      {storyPublishError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {storyPublishError}
        </Alert>
      )}
      {storyPublishSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {storyPublishSuccess}
        </Alert>
      )}
      <Box sx={{ mt: 4, borderTop: '1px solid #eee', paddingTop: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Generated Story Content
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
          }}
        >
          {generatedStoryContent}
        </Box>
      </Box>
    </Box>
  );
};

export default StoryContentGeneratorTab;
