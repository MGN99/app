import React, { useState } from 'react';
import {
  Paper, Typography, Button, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Switch, FormControlLabel
} from '@mui/material';

const UserSettings = () => {
  // States for managing dialogs
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const [openNotificationsDialog, setOpenNotificationsDialog] = useState(false);
  const [openPrivacyDialog, setOpenPrivacyDialog] = useState(false);
  
  // Toggle dialogs
  const handleOpenSecurityDialog = () => setOpenSecurityDialog(true);
  const handleCloseSecurityDialog = () => setOpenSecurityDialog(false);

  const handleOpenNotificationsDialog = () => setOpenNotificationsDialog(true);
  const handleCloseNotificationsDialog = () => setOpenNotificationsDialog(false);

  const handleOpenPrivacyDialog = () => setOpenPrivacyDialog(true);
  const handleClosePrivacyDialog = () => setOpenPrivacyDialog(false);

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <List>
        {/* Account Security */}
        <ListItem>
          <ListItemText
            primary="Account Security"
            secondary="Change your password and update security settings."
          />
          <Button variant="contained" color="primary" onClick={handleOpenSecurityDialog}>
            Edit Security
          </Button>
        </ListItem>
        <Divider variant="middle" />

        {/* Notification Preferences */}
        <ListItem>
          <ListItemText
            primary="Notification Preferences"
            secondary="Manage your email and push notification settings."
          />
          <Button variant="contained" color="primary" onClick={handleOpenNotificationsDialog}>
            Edit Notifications
          </Button>
        </ListItem>
        <Divider variant="middle" />

        {/* Privacy Settings */}
        <ListItem>
          <ListItemText
            primary="Privacy Settings"
            secondary="Adjust your privacy and data sharing preferences."
          />
          <Button variant="contained" color="primary" onClick={handleOpenPrivacyDialog}>
            Edit Privacy
          </Button>
        </ListItem>
      </List>

      {/* Dialog for Account Security */}
      <Dialog open={openSecurityDialog} onClose={handleCloseSecurityDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your current password and a new password to update your account security.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSecurityDialog} color="secondary">Cancel</Button>
          <Button onClick={handleCloseSecurityDialog} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Notification Preferences */}
      <Dialog open={openNotificationsDialog} onClose={handleCloseNotificationsDialog}>
        <DialogTitle>Notification Preferences</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Manage how you receive notifications from the app.
          </DialogContentText>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Email Notifications"
          />
          <FormControlLabel
            control={<Switch />}
            label="Push Notifications"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotificationsDialog} color="secondary">Cancel</Button>
          <Button onClick={handleCloseNotificationsDialog} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Privacy Settings */}
      <Dialog open={openPrivacyDialog} onClose={handleClosePrivacyDialog}>
        <DialogTitle>Privacy Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Adjust your privacy settings, such as data sharing preferences and profile visibility.
          </DialogContentText>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Share my data with third parties"
          />
          <FormControlLabel
            control={<Switch />}
            label="Make my profile visible to others"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrivacyDialog} color="secondary">Cancel</Button>
          <Button onClick={handleClosePrivacyDialog} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserSettings;
