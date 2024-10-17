import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Link,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  background: 'linear-gradient(45deg, #1F3B60 30%, #122841 90%)',
  border: 0,
  borderRadius: 30,
  boxShadow: '0 3px 5px 2px rgba(31, 59, 96, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    backgroundColor: '#122841',
  },
});

const StyledBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(to top, #003366, #00509E)`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nameLastName: '',  
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            registerUsuario(
              nameLastName: "${formData.nameLastName}", 
              username: "${formData.username}", 
              email: "${formData.email}", 
              password: "${formData.password}"
            ) {
              userID
              username
              email
            }
          }
        `
      });

      const { data } = response;
      if (data.errors) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }

      console.log('Registro exitoso:', data.data.registerUsuario);
      navigate('/login'); 

    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledBackground>
      <Paper
        elevation={10}
        sx={{
          p: 4,
          backgroundColor: '#fff',
          borderRadius: '20px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom color="#1F3B60" fontWeight="600">
          Crear una Cuenta
        </Typography>
        <Typography variant="body2" gutterBottom color="#555">
          Por favor llena los campos para crear una cuenta nueva
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Nombre completo"
            variant="outlined"
            fullWidth
            name="nameLastName"
            value={formData.nameLastName}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Nombre de usuario"
            variant="outlined"
            fullWidth
            name="username"
            value={formData.username}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Correo electrónico"
            variant="outlined"
            type="email"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Contraseña"
            variant="outlined"
            type="password"
            fullWidth
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          {error && (
            <Typography sx={{ color: 'error.main', mt: 2 }} variant="body2">
              {error}
            </Typography>
          )}
          <StyledButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </StyledButton>
          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#555' }}>
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" variant="body2" sx={{ color: '#1F3B60' }}>
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      </Paper>
    </StyledBackground>
  );
};

export default RegisterPage;
