import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme

import ComponentGeneratorTab from './ComponentGeneratorTab';
import StoryContentGeneratorTab from './StoryContentGeneratorTab';
import AccessibilityReportTab from './AccessibilityReportTab';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SpacePluginUI: React.FC = () => {
  const theme = useTheme(); // Initialize theme
  const [tabValue, setTabValue] = useState(0);
  const [spaceId, setSpaceId] = useState('');
  const [componentPrompt, setComponentPrompt] = useState('');
  const [generatedComponentBlocks, setGeneratedComponentBlocks] = useState('// Generated component JSON will appear here');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [generatedStoryContent, setGeneratedStoryContent] = useState('// Generated story JSON will appear here');
  const [accessibilityReport, setAccessibilityReport] = useState('Click "Generate Report" to see an AI-powered accessibility analysis.');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Unified Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing(2, 3), // Consistent padding
          borderBottom: '1px solid #eee', // Subtle separator
          marginBottom: theme.spacing(3), // Space below header
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Prompt Blok
        </Typography>
        <Select
          value={spaceId}
          onChange={(e) => setSpaceId(e.target.value as string)}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{ width: '250px' }}
        >
          <MenuItem value="" disabled>
            Select Space ID
          </MenuItem>
          <MenuItem value="287453774383157">Your demo space</MenuItem>
          <MenuItem value="287454392109369">hackathon_space</MenuItem>
        </Select>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}> {/* Added horizontal padding */}
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="plugin tabs">
          <Tab label="Component Generator" {...a11yProps(0)} />
          <Tab label="Story Content Generator" {...a11yProps(1)} />
          <Tab label="Accessibility Report" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={tabValue} index={0}>
        <ComponentGeneratorTab
          componentPrompt={componentPrompt}
          setComponentPrompt={setComponentPrompt}
          generatedComponentBlocks={generatedComponentBlocks}
          setGeneratedComponentBlocks={setGeneratedComponentBlocks}
          spaceId={spaceId}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={1}>
        <StoryContentGeneratorTab
          storyPrompt={storyPrompt}
          setStoryPrompt={setStoryPrompt}
          generatedStoryContent={generatedStoryContent}
          setGeneratedStoryContent={setGeneratedStoryContent}
          spaceId={spaceId}
        />
      </CustomTabPanel>

      <CustomTabPanel value={tabValue} index={2}>
        <AccessibilityReportTab
          accessibilityReport={accessibilityReport}
          setAccessibilityReport={setAccessibilityReport}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default SpacePluginUI;
