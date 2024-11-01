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
import useCartStore from '../MainPage/CartStore';

const StyledButton = styled(Button)({
  background: 'linear-gradient(45deg, #1F3B60 30%, #122841 90%)',
  borderRadius: 30,
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': { backgroundColor: '#122841' },
});

const StyledBackground = styled(Box)({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: 'linear-gradient(to top, #003366, #00509E)',
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
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
        localStorage.setItem('username', email);  // Guarda el username
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
      <Paper elevation={10} sx={{ p: 4, maxWidth: '400px', borderRadius: '20px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom color="#1F3B60">Login</Typography>
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
          
          <StyledButton type="submit" fullWidth disabled={loading} sx={{ mt: 3 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login Now'}
          </StyledButton>
        </Box>
      </Paper>
    </StyledBackground>
  );
};

export default Login;
