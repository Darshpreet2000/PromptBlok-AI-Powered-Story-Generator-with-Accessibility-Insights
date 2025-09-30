import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { STORYBLOK_ACCESS_TOKEN } from '@/constants/access_constants';
import { useEffect } from 'react';

const StyledSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  border: '1px solid #eee',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

const StyledPre = styled('pre')(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
}));

interface StoryContentGeneratorTabProps {
  storyPrompt: string;
  setStoryPrompt: (prompt: string) => void;
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
  generatedStoryContent: string;
  setGeneratedStoryContent: (content: string) => void;
  spaceId: string; // Add spaceId prop
}

const StoryContentGeneratorTab: React.FC<StoryContentGeneratorTabProps> = ({
  storyPrompt,
  setStoryPrompt,
  selectedComponents,
  setSelectedComponents,
  generatedStoryContent,
  setGeneratedStoryContent,
  spaceId, // Destructure spaceId
}) => {
  const [availableComponents, setAvailableComponents] = useState<any[]>([]);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [componentsError, setComponentsError] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [storyGenerationError, setStoryGenerationError] = useState<string | null>(null);
  const [isPublishingStory, setIsPublishingStory] = useState(false);
  const [storyPublishError, setStoryPublishError] = useState<string | null>(null);
  const [storyPublishSuccess, setStoryPublishSuccess] = useState<string | null>(null);


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
    <StyledSection>
      <Typography variant="h5" component="h2" gutterBottom>
        Story Content Generator
      </Typography>
      <Typography variant="body1" paragraph>
        Fetch existing components and generate story content based on a prompt.
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="component-select-label">Select Existing Components</InputLabel>
        <Select
          labelId="component-select-label"
          id="component-select"
          multiple
          value={selectedComponents}
          onChange={(e) => setSelectedComponents(e.target.value as string[])}
          renderValue={(selected) => (selected as string[]).join(', ')}
          label="Select Existing Components"
          disabled={isLoadingComponents || isGeneratingStory}
        >
          {isLoadingComponents && <MenuItem disabled>Loading components...</MenuItem>}
          {componentsError && <MenuItem disabled>Error: {componentsError}</MenuItem>}
          {!isLoadingComponents && availableComponents.length === 0 && !componentsError && (
            <MenuItem disabled>No components found. Enter a Space ID.</MenuItem>
          )}
          {availableComponents.map((component) => (
            <MenuItem key={component.id} value={component.name}>
              {component.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGenerateStoryContent}
        sx={{ mt: 2 }}
        disabled={isGeneratingStory || !storyPrompt.trim() || selectedComponents.length === 0}
      >
        {isGeneratingStory ? <CircularProgress size={24} color="inherit" /> : 'Generate Story Content'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePublishStoryContent}
        sx={{ mt: 2, ml: 2 }}
        disabled={isGeneratingStory || isPublishingStory || !generatedStoryContent.trim()}
      >
        {isPublishingStory ? <CircularProgress size={24} color="inherit" /> : 'Publish Story Content'}
      </Button>
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
        <Typography variant="h6" component="h3" gutterBottom>
          Generated Story Content
        </Typography>
        <StyledPre>
          {generatedStoryContent}
        </StyledPre>
      </Box>
    </StyledSection>
  );
};

export default StoryContentGeneratorTab;
