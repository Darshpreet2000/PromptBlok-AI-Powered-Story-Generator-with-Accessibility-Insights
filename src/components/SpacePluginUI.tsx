import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
  const [tabValue, setTabValue] = useState(0);
  const [spaceId, setSpaceId] = useState('');
  const [componentPrompt, setComponentPrompt] = useState('');
  const [generatedComponentBlocks, setGeneratedComponentBlocks] = useState('// Generated component JSON will appear here');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [generatedStoryContent, setGeneratedStoryContent] = useState('// Generated story JSON will appear here');
  const [accessibilityReport, setAccessibilityReport] = useState('Click "Generate Report" to see an AI-powered accessibility analysis.');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Storyblok Space Plugin
      </Typography>

      <TextField
        placeholder="Space ID"
        value={spaceId}
        onChange={(e) => setSpaceId(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ width: '150px', marginTop: -5, float: 'right' }}
        inputProps={{ style: { fontSize: '0.8rem' } }}
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
          selectedComponents={selectedComponents}
          setSelectedComponents={setSelectedComponents}
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
