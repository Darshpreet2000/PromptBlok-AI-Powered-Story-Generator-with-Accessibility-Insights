import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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

const AccessibilityReportTab: React.FC<AccessibilityReportTabProps> = ({
  accessibilityReport,
  setAccessibilityReport,
}) => {
  const handleGenerateAccessibilityReport = () => {
    console.log('Generating accessibility report...');
    // Mock accessibility report content
    setAccessibilityReport(`
      <Typography variant="h6" component="h4" gutterBottom>Overall Accessibility Score: 85/100 - Good</Typography>
      <Typography variant="body2" paragraph>
        This is an AI-generated accessibility report. Please review it carefully, as AI models can make mistakes.
      </Typography>
      <Typography variant="h6" component="h4" gutterBottom>Key Findings:</Typography>
      <List>
        <ListItem>
          <ListItemIcon><ErrorOutlineIcon color="error" /></ListItemIcon>
          <ListItemText primary="Missing alt text on 3 images" secondary="Ensure all images have descriptive alt attributes for screen readers." />
        </ListItem>
        <ListItem>
          <ListItemIcon><ErrorOutlineIcon color="warning" /></ListItemIcon>
          <ListItemText primary="Low contrast text detected in header" secondary="Increase contrast ratio for better readability, especially for users with visual impairments." />
        </ListItem>
        <ListItem>
          <ListItemIcon><CheckCircleOutlineIcon color="success" /></ListItemIcon>
          <ListItemText primary="Keyboard navigation is functional" secondary="Users can navigate interactive elements using only the keyboard." />
        </ListItem>
        <ListItem>
          <ListItemIcon><InfoOutlinedIcon color="info" /></ListItemIcon>
          <ListItemText primary="Interactive elements lack proper ARIA labels" secondary="Add appropriate ARIA labels to buttons and links for better context." />
        </ListItem>
      </List>
      <Typography variant="h6" component="h4" gutterBottom>Suggestions for Improvement:</Typography>
      <List>
        <ListItem>
          <ListItemText primary="1. Add descriptive alt text to all images." />
        </ListItem>
        <ListItem>
          <ListItemText primary="2. Increase contrast ratio for text elements, especially in headers and important content." />
        </ListItem>
        <ListItem>
          <ListItemText primary="3. Ensure all buttons and links have appropriate ARIA attributes (e.g., aria-label, aria-describedby)." />
        </ListItem>
        <ListItem>
          <ListItemText primary="4. Conduct manual accessibility testing with assistive technologies." />
        </ListItem>
      </List>
    `);
  };

  return (
    <StyledSection>
      <Typography variant="h5" component="h2" gutterBottom>
        AI Accessibility Report
      </Typography>
      <Typography variant="body1" paragraph>
        Generate an AI-powered accessibility report for your content.
      </Typography>
      <Button
        variant="contained"
        color="info"
        onClick={handleGenerateAccessibilityReport}
        sx={{ mt: 2 }}
      >
        Generate Report
      </Button>
      <Box sx={{ mt: 4, borderTop: '1px solid #eee', paddingTop: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          Report Details
        </Typography>
        <Box dangerouslySetInnerHTML={{ __html: accessibilityReport }} />
      </Box>
    </StyledSection>
  );
};

export default AccessibilityReportTab;
