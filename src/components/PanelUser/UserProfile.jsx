import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

const UserProfile = () => {
  const [fullNameState, setFullNameState] = useState('');
  const [emailState, setEmailState] = useState('');
  const [usernameState, setUsernameState] = useState('');

  // Cargar los datos actuales del usuario (nombre, email y username)
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      fetchUserData(email);
    }
  }, []);

  const fetchUserData = async (email) => {
    try {
      // Obtener el username con el email
      const response = await axios.post('http://localhost:8080/graphql', {
        query: `
          query {
            obtenerUsernamePorEmail(email: "${email}")
          }
        `,
      });

      const username = response.data.data.obtenerUsernamePorEmail;
      
      // Obtener los detalles del usuario (nombre completo y email)
      const userResponse = await axios.post('http://localhost:8080/graphql', {
        query: `
          query {
            userByUsername(username: "${username}") {
              nameLastName
              email
              username
            }
          }
        `,
      });

      const user = userResponse.data.data.userByUsername;

      // Establecer los estados con los datos obtenidos
      setFullNameState(user.nameLastName);
      setEmailState(user.email);
      setUsernameState(user.username);

    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  // Función para manejar la actualización de los datos
  const handleSubmit = async () => {
    try {
      const email = localStorage.getItem("email");
      
      // Enviar las mutaciones en secuencia
      // 1. Actualizar nombre completo
      await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            actualizarNombreCompleto(email: "${email}", newNameLastName: "${fullNameState}") {
              userID
              nameLastName
              email
            }
          }
        `,
      });

      // 2. Actualizar correo electrónico
      await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            actualizarEmail(email: "${email}", newEmail: "${emailState}") {
              userID
              username
              email
            }
          }
        `,
      });

      // 3. Actualizar nombre de usuario
      await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            actualizarUsernameConEmail(email: "${email}", newUsername: "${usernameState}") {
              userID
              username
              email
            }
          }
        `,
      });

      alert("Datos actualizados con éxito.");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">{usernameState}</Typography>
        <Typography variant="body2" color="textSecondary">Member since January 2024</Typography>
      </Box>
      <Box component="form">
        <TextField
          label="Full Name"
          value={fullNameState}
          onChange={(e) => setFullNameState(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={emailState}
          onChange={(e) => setEmailState(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Username"
          value={usernameState}
          onChange={(e) => setUsernameState(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};

export default UserProfile;
