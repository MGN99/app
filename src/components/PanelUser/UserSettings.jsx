import React, { useState } from 'react';
import {
  Paper, Typography, Button, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, CircularProgress, Box
} from '@mui/material';
import axios from 'axios';
import SecurityIcon from '@mui/icons-material/Security';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';

const UserSettings = () => {
  const [openSecurityDialog, setOpenSecurityDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Abrir y cerrar el cuadro de diálogo para cambiar la contraseña
  const handleOpenSecurityDialog = () => setOpenSecurityDialog(true);
  const handleCloseSecurityDialog = () => {
    setOpenSecurityDialog(false);
    setCurrentPassword('');
    setNewPassword('');
    setError('');
    setSuccessMessage('');
  };

  // Función para manejar el cambio de contraseña
  const handleChangePassword = async () => {
    const email = localStorage.getItem('email'); // Obtener el correo del usuario del localStorage
    if (!email) {
      setError('No se encontró el correo en el almacenamiento local.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            actualizarContrasena(email: "${email}", oldPassword: "${currentPassword}", newPassword: "${newPassword}")
          }
        `,
      });

      if (response.data.errors) {
        setError('Error al actualizar la contraseña. Verifica que la contraseña actual sea correcta.');
      } else {
        setSuccessMessage('¡Contraseña actualizada con éxito!');
      }
    } catch (error) {
      setError('Ocurrió un error al actualizar la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        padding: 4,
        borderRadius: 3,
        maxWidth: 600,
        margin: '2rem auto',
        background: 'linear-gradient(to right, #f8f9fa, #e9ecef)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <LockIcon fontSize="large" color="primary" />
        <Typography variant="h4" ml={2} fontWeight="bold">
          Configuración de Cuenta
        </Typography>
      </Box>

      <List>
        <ListItem>
          <ListItemText
            primary={
              <Typography variant="h6" fontWeight="bold">
                Seguridad de la cuenta
              </Typography>
            }
            secondary="Actualiza tu contraseña para mejorar la seguridad."
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SecurityIcon />}
            onClick={handleOpenSecurityDialog}
            sx={{ textTransform: 'capitalize' }}
          >
            Cambiar Contraseña
          </Button>
        </ListItem>
        <Divider variant="middle" sx={{ my: 2 }} />
      </List>

      <Dialog open={openSecurityDialog} onClose={handleCloseSecurityDialog}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <SecurityIcon color="primary" />
            <Typography variant="h6" ml={1}>
              Cambiar Contraseña
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingresa tu contraseña actual y la nueva contraseña para
            actualizar la seguridad de tu cuenta.
          </DialogContentText>
          <Box mt={2}>
            <TextField
              autoFocus
              margin="dense"
              label="Contraseña Actual"
              type="password"
              fullWidth
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Nueva Contraseña"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="primary" mt={2}>
              {successMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSecurityDialog}
            startIcon={<CancelIcon />}
            color="secondary"
            sx={{ textTransform: 'capitalize' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            color="primary"
            disabled={loading}
            variant="contained"
            sx={{ textTransform: 'capitalize' }}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserSettings;
