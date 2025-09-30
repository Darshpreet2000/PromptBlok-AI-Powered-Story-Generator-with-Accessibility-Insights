import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Settings: React.FC = () => {
  const router = useRouter();
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
    router.back();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
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
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
        <Link href="/plugin" passHref>
          <Button variant="outlined">Back to Plugin</Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Settings;