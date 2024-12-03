import React, { useState } from 'react';
import {
  Paper, Typography, Button, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, CircularProgress
} from '@mui/material';
import axios from 'axios';

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

      // Si hay errores, se muestran
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
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Configuración
      </Typography>

      <List>
        {/* Seguridad de la cuenta */}
        <ListItem>
          <ListItemText
            primary="Seguridad de la cuenta"
            secondary="Cambia tu contraseña."
          />
          <Button variant="contained" color="primary" onClick={handleOpenSecurityDialog}>
            Editar Seguridad
          </Button>
        </ListItem>
        <Divider variant="middle" />
      </List>

      {/* Cuadro de diálogo para la seguridad de la cuenta */}
      <Dialog open={openSecurityDialog} onClose={handleCloseSecurityDialog}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ingresa tu contraseña actual y la nueva para actualizar la seguridad de tu cuenta.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Contraseña Actual"
            type="password"
            fullWidth
            variant="outlined"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
          {error && <Typography color="error">{error}</Typography>}
          {successMessage && <Typography color="primary">{successMessage}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSecurityDialog} color="secondary">Cancelar</Button>
          <Button
            onClick={handleChangePassword}
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserSettings;
