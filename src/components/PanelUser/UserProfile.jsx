import React from 'react';
import { Avatar, Box, Button, TextField, Typography, Paper } from '@mui/material';

const UserProfile = () => {
  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          alt="Jane Smith"
          src="/path/to/profile.jpg"
          sx={{ width: 150, height: 150, mr: 2 }}
        />
        <Box>
          <Typography variant="h4">Jane Smith</Typography>
          <Typography variant="body2" color="textSecondary">Member since January 2024</Typography>
        </Box>
      </Box>
      <Box component="form">
        <TextField label="Full Name" defaultValue="Jane Smith" fullWidth margin="normal" />
        <TextField label="Email" defaultValue="jane.smith@example.com" fullWidth margin="normal" />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>Save Changes</Button>
      </Box>
    </Paper>
  );
};

export default UserProfile;
