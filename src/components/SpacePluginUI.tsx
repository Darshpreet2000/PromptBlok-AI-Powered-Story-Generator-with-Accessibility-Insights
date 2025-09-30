import React, { useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Typography,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import ArticleIcon from '@mui/icons-material/Article';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import Link from 'next/link';

import ComponentGeneratorTab from './ComponentGeneratorTab';
import StoryContentGeneratorTab from './StoryContentGeneratorTab';
import AccessibilityReportTab from './AccessibilityReportTab';
import SettingsTab from './SettingsTab';

const NAV_ITEMS = [
  { id: 'component', label: 'Component Generator', icon: CodeIcon, description: 'Enter a prompt to generate Storyblok component blocks.' },
  { id: 'story', label: 'Story Content Generator', icon: ArticleIcon, description: 'Generate complete Storyblok stories by combining your available components with AI.' },
  { id: 'accessibility', label: 'Accessibility Report', icon: AccessibilityNewIcon, description: 'Generate comprehensive accessibility reports for your Storyblok content using AI analysis.' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, description: 'Configure your personal access token and space settings.' },
];

const SpacePluginUI: React.FC = () => {
  const theme = useTheme(); // Initialize theme
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedNav, setSelectedNav] = useState('component');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [spaceId, setSpaceId] = useState('');
  const [componentPrompt, setComponentPrompt] = useState('');
  const [generatedComponentBlocks, setGeneratedComponentBlocks] = useState('// Generated component JSON will appear here');
  const [storyPrompt, setStoryPrompt] = useState('');
  const [generatedStoryContent, setGeneratedStoryContent] = useState('// Generated story JSON will appear here');
  const [accessibilityReport, setAccessibilityReport] = useState('Click "Generate Report" to see an AI-powered accessibility analysis.');

  useEffect(() => {
    const storedSpaceId = localStorage.getItem('spaceId') || '';
    const storedSelectedNav =  'settings';
    setSpaceId(storedSpaceId);
    setSelectedNav(storedSelectedNav);
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedNav', selectedNav);
  }, [selectedNav]);

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 900,
          color: theme.palette.primary.main,
          letterSpacing: '0.05em',
          fontSize: '1.5rem',
          textTransform: 'uppercase',
          mb: 1,
          textAlign: 'center',
        }}
      >
        Prompt Blok
      </Typography>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={selectedNav === item.id}
              onClick={() => {
                setSelectedNav(item.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedNav === item.id ? 'inherit' : theme.palette.text.secondary }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: selectedNav === item.id ? 600 : 400,
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  sx: { color: selectedNav === item.id ? 'inherit' : theme.palette.text.secondary, opacity: 0.7 },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ width: '100%', p: 0, borderRadius: 0, overflow: 'hidden' }}>
      {/* Unified Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { xs: theme.spacing(2, 3), md: theme.spacing(3, 4) },
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          boxShadow: theme.shadows[2],
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ color: 'white', mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'white',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Prompt Blok
          </Typography>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: theme.palette.grey[50],
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            backgroundColor: 'white',
            minHeight: 400,
          }}
        >
          {selectedNav === 'component' && (
            <ComponentGeneratorTab
              componentPrompt={componentPrompt}
              setComponentPrompt={setComponentPrompt}
              generatedComponentBlocks={generatedComponentBlocks}
              setGeneratedComponentBlocks={setGeneratedComponentBlocks}
              spaceId={spaceId}
            />
          )}
          {selectedNav === 'story' && (
            <StoryContentGeneratorTab
              storyPrompt={storyPrompt}
              setStoryPrompt={setStoryPrompt}
              generatedStoryContent={generatedStoryContent}
              setGeneratedStoryContent={setGeneratedStoryContent}
              spaceId={spaceId}
            />
          )}
          {selectedNav === 'accessibility' && (
            <AccessibilityReportTab
              accessibilityReport={accessibilityReport}
              setAccessibilityReport={setAccessibilityReport}
            />
          )}
          {selectedNav === 'settings' && (
            <SettingsTab />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default SpacePluginUI;
