import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TableChartIcon from '@mui/icons-material/TableChart';
import { STORYBLOK_ACCESS_TOKEN } from '@/constants/access_constants';

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

interface ComponentGeneratorTabProps {
  componentPrompt: string;
  setComponentPrompt: (prompt: string) => void;
  generatedComponentBlocks: string;
  setGeneratedComponentBlocks: (blocks: string) => void;
  spaceId: string;
}

interface StoryblokField {
  type: string;
  display_name?: string;
  required?: boolean;
  default_value?: string;
  options?: { value: string; name: string }[];
  // Add other common field properties as needed
}

interface StoryblokSchema {
  [key: string]: StoryblokField;
}

interface StoryblokComponent {
  name: string;
  display_name?: string;
  schema: StoryblokSchema;
  is_nestable: boolean;
  is_root: boolean;
}

const ComponentGeneratorTab: React.FC<ComponentGeneratorTabProps> = ({
  componentPrompt,
  setComponentPrompt,
  generatedComponentBlocks,
  setGeneratedComponentBlocks,
  spaceId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isComponentGenerated, setIsComponentGenerated] = useState(false);
  const [parsedComponentSchema, setParsedComponentSchema] = useState<StoryblokSchema | null>(null);

  const renderFieldPreview = (fieldName: string, field: StoryblokField) => {
    const label = field.display_name || fieldName;
    const commonProps = {
      label: label,
      variant: 'outlined' as const,
      fullWidth: true,
      margin: 'normal' as const,
      disabled: true,
      key: fieldName,
    };

    switch (field.type) {
      case 'text':
        return <TextField {...commonProps} />;
      case 'textarea':
        return <TextField {...commonProps} multiline rows={3} />;
      case 'number':
        return <TextField {...commonProps} type="number" />;
      case 'boolean':
        return (
          <FormControlLabel
            control={<Switch checked={field.default_value === 'true'} disabled />}
            label={label}
            sx={{ mt: 2, mb: 1 }}
            key={fieldName}
          />
        );
      case 'option':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{label}</InputLabel>
            <Select value={field.default_value || ''} disabled>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'options':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{label}</InputLabel>
            <Select multiple value={Array.isArray(field.default_value) ? field.default_value : []} disabled>
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'asset':
      case 'multiasset':
        return (
          <Button
            {...commonProps}
            startIcon={<ImageIcon />}
            sx={{ justifyContent: 'flex-start', mt: 2, mb: 1 }}
          >
            {label} (Select Asset)
          </Button>
        );
      case 'multilink':
        return (
          <Button
            {...commonProps}
            startIcon={<LinkIcon />}
            sx={{ justifyContent: 'flex-start', mt: 2, mb: 1 }}
          >
            {label} (Add Link)
          </Button>
        );
      case 'richtext':
      case 'markdown':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={5}
            placeholder={`Enter ${label} content...`}
            label={`${label} Editor`}
          />
        );
      case 'datetime':
        return <TextField {...commonProps} type="datetime-local" />;
      case 'bloks':
        return (
          <Box key={fieldName} sx={{ mt: 2, mb: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddCircleOutlineIcon /> {label} (Nested Blocks)
            </Typography>
          </Box>
        );
      case 'table':
        return (
          <Box key={fieldName} sx={{ mt: 2, mb: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TableChartIcon /> {label} (Table Editor)
            </Typography>
          </Box>
        );
      case 'section':
        return (
          <Box key={fieldName} sx={{ mt: 2, mb: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
            <Typography variant="subtitle1">{label} (Group)</Typography>
          </Box>
        );
      case 'custom':
        return <TextField {...commonProps} placeholder={`Custom Plugin: ${label}`} />;
      default:
        return <TextField {...commonProps} placeholder={`Unsupported Type: ${field.type}`} />;
    }
  };

  const handleGenerateComponent = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setIsComponentGenerated(false);
    setGeneratedComponentBlocks('// Generating component...');
    setParsedComponentSchema(null); // Reset parsed schema

    try {
      const response = await fetch('/api/generate-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: componentPrompt, geminiModel: 'gemini-2.0-flash' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate component.');
      }

      const data = await response.json();
      setGeneratedComponentBlocks(JSON.stringify(data, null, 2));
      setIsComponentGenerated(true);
      setSuccessMessage('Component schema generated successfully!');

      // Parse the schema for UI preview
      if (data && data.component && data.component.schema) {
        setParsedComponentSchema(data.component.schema);
      }
    } catch (err) {
      setError((err as Error).message);
      setGeneratedComponentBlocks('// Error generating component.');
      setParsedComponentSchema(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishComponent = async () => {
    setIsPublishing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const componentData: { component: StoryblokComponent } = JSON.parse(generatedComponentBlocks); // Ensure it's parsed JSON
      const componentSchema = componentData.component;

      const response = await fetch('/api/create-storyblok-component', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ component: componentSchema, accessToken: STORYBLOK_ACCESS_TOKEN, spaceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish component to Storyblok.');
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setIsComponentGenerated(false); // Component published, reset state
      setGeneratedComponentBlocks('// Component published. Generate a new one!');
      setParsedComponentSchema(null); // Clear preview after publishing
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <StyledSection>
      <Typography variant="h5" component="h2" gutterBottom>
        Component Generator
      </Typography>
      <Typography variant="body1" paragraph>
        Enter a prompt to generate component blocks.
      </Typography>
      <TextField
        label="Component Prompt"
        multiline
        rows={5}
        fullWidth
        value={componentPrompt}
        onChange={(e) => setComponentPrompt(e.target.value)}
        margin="normal"
        variant="outlined"
        disabled={isLoading || isPublishing}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerateComponent}
        sx={{ mt: 2, mr: 2 }}
        disabled={isLoading || isPublishing || !componentPrompt.trim()}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Component'}
      </Button>
      <Button
        variant="contained"
        color="success"
        onClick={handlePublishComponent}
        sx={{ mt: 2 }}
        disabled={!isComponentGenerated || isPublishing}
      >
        {isPublishing ? <CircularProgress size={24} color="inherit" /> : 'Publish Component'}
      </Button>

      {successMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4, borderTop: '1px solid #eee', paddingTop: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Raw Component JSON
        </Typography>
        <StyledPre>
          {generatedComponentBlocks}
        </StyledPre>

        {parsedComponentSchema && (
          <Box sx={{ mt: 4, borderTop: '1px solid #eee', paddingTop: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              UI Preview
            </Typography>
            <Box sx={{ mt: 2 }}>
              {Object.entries(parsedComponentSchema).map(([fieldName, field]) =>
                renderFieldPreview(fieldName, field)
              )}
            </Box>
          </Box>
        )}
      </Box>
    </StyledSection>
  );
};

export default ComponentGeneratorTab;
