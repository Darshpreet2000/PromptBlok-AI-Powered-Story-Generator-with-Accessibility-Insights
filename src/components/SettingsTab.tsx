import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

const SettingsTab: React.FC = () => {
  const [personalAccessToken, setPersonalAccessToken] = useState('');
  const [spaceId, setSpaceId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('personalAccessToken') || '';
    const space = localStorage.getItem('spaceId') || '';
    setPersonalAccessToken(token);
    setSpaceId(space);
  }, []);

  const handleSave = () => {
    localStorage.setItem('personalAccessToken', personalAccessToken);
    localStorage.setItem('spaceId', spaceId);
    alert('Settings saved!');
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <TextField
          label="Personal Access Token"
          value={personalAccessToken}
          onChange={(e) => setPersonalAccessToken(e.target.value)}
          fullWidth
          margin="normal"
          type="password"
        />
        <Select
          value={spaceId}
          onChange={(e) => setSpaceId(e.target.value)}
          displayEmpty
          fullWidth
          margin="dense"
        >
          <MenuItem value="" disabled>
            Select Space ID
          </MenuItem>
          <MenuItem value="287453774383157">Your demo space</MenuItem>
          <MenuItem value="287454392109369">hackathon_space</MenuItem>
        </Select>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            Save Settings
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsTab;