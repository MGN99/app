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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            loginUsuario(identificador: "${email}", password: "${password}")
          }
        `,
      });

      const { data } = response;
      if (data.errors) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }

      const message = data.data.loginUsuario;

      if (message === 'Inicio de sesión exitoso') {
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('email', email);
        navigate('/');
      } else {
        setError('Login failed');
      }
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
          Login
        </Typography>
        <Typography variant="body2" gutterBottom color="#555">
          Ingrese sus credenciales
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <Grid container justifyContent="flex-end">
            <Link href="#" variant="body2" sx={{ color: '#1F3B60' }}>
              ¿Olvidaste tu contraseña? 
            </Link>
          </Grid>
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login Now'}
          </StyledButton>
          <Typography variant="body2" align="center" sx={{ mt: 3, color: '#555' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/register" variant="body2" sx={{ color: '#1F3B60' }}>
              Registrate aqui.
            </Link>
          </Typography>
        </Box>
      </Paper>
    </StyledBackground>
  );
};

export default Login;
