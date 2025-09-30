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
  Card,
  CardContent,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/material/styles';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import TableChartIcon from '@mui/icons-material/TableChart';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Section */}
      <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Component Generator
          </Typography>
          <Typography variant="body1" paragraph color="text.secondary">
            Enter a prompt to generate Storyblok component blocks.
          </Typography>

          <Accordion elevation={0} sx={{ mb: 2, '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="component-help-content"
              id="component-help-header"
              sx={{ px: 0, minHeight: 48 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <HelpOutlineIcon color="primary" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  How to use Component Generator
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0 }}>
              <Typography variant="body2" paragraph>
                <strong>What it does:</strong> This AI-powered tool generates complete Storyblok component schemas based on your natural language descriptions. The generated components include all necessary fields, validation rules, and UI previews.
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Tips for better results:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Be specific about the component's purpose (e.g., "hero banner", "testimonial card", "pricing table")
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Mention required fields and their types (text, image, link, etc.)
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Include styling or layout preferences when relevant
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Specify if the component should be nestable or have specific validation rules
                </Typography>
              </Box>

              <Typography variant="body2" paragraph>
                <strong>Example prompts:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  label="Create a hero banner with title, subtitle, background image, and CTA button"
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setComponentPrompt('Create a hero banner with title, subtitle, background image, and CTA button')}
                />
                <Chip
                  label="Build a testimonial component with name, role, company, photo, and quote"
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setComponentPrompt('Build a testimonial component with name, role, company, photo, and quote')}
                />
                <Chip
                  label="Design a pricing card with plan name, price, features list, and signup button"
                  size="small"
                  variant="outlined"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setComponentPrompt('Design a pricing card with plan name, price, features list, and signup button')}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                After generating, review the UI preview and publish directly to your selected Storyblok space.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <TextField
            label="Component Prompt"
            multiline
            rows={5}
            value={componentPrompt}
            onChange={(e) => setComponentPrompt(e.target.value)}
            margin="normal"
            variant="outlined"
            disabled={isLoading || isPublishing}
            sx={{ mb: 3, maxWidth: 800, width: '100%' }}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateComponent}
              disabled={isLoading || isPublishing || !componentPrompt.trim()}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
              sx={{ minWidth: 160 }}
            >
              {isLoading ? 'Generating...' : 'Generate Component'}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handlePublishComponent}
              disabled={!isComponentGenerated || isPublishing}
              startIcon={isPublishing ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              sx={{ minWidth: 160 }}
            >
              {isPublishing ? 'Publishing...' : 'Publish Component'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Alerts */}
      {(successMessage || error) && (
        <Box>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      )}

      {/* Two Column Layout for Results */}
      {generatedComponentBlocks !== '// Generated component JSON will appear here' && (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Results Section - Left */}
          <Box sx={{ flex: 1 }}>
            <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Raw Component JSON
                </Typography>
                <StyledPre>
                  {generatedComponentBlocks}
                </StyledPre>
              </CardContent>
            </Card>
          </Box>

          {/* UI Preview Section - Right */}
          {parsedComponentSchema && (
            <Box sx={{ flex: 1 }}>
              <Card elevation={2} sx={{ transition: 'all 0.3s ease', '&:hover': { elevation: 4 } }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    UI Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Preview how your component fields will appear in the Storyblok editor.
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(parsedComponentSchema).map(([fieldName, field]) => (
                      <Paper key={fieldName} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                        {renderFieldPreview(fieldName, field)}
                      </Paper>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ComponentGeneratorTab;
