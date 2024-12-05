import React, { useEffect, useState } from 'react';
import { viewCartByEmail, removeFromCart } from '../MainPage/CartService';
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Container,
  Card,
  CardContent,
  CardActions,
  Divider,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import useCartStore from './CartStore';
import axios from 'axios';

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const email = localStorage.getItem('email');
  const { cartItems, removeFromCart: removeItemFromStore } = useCartStore();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!email) return;

      setLoading(true);
      try {
        const data = await viewCartByEmail(email);
        if (data) {
          useCartStore.setState({ cartItems: data });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [email]);

  const handleRemoveFromCart = async (courseID) => {
    try {
      await removeFromCart(courseID);
      removeItemFromStore(courseID);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePurchase = async () => {
    if (!email) {
      setPurchaseStatus('Error: No se encontró el email del usuario.');
      return;
    }

    setLoading(true);
    setPurchaseStatus('');

    try {
      const response = await axios.post('http://localhost:3001/payment/create', {
        email,
      });

      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        setPurchaseStatus('Error al realizar la compra.');
      }
    } catch (error) {
      console.error('Error al conectar con el servicio de pagos:', error);
      setPurchaseStatus('Error al conectar con el servicio de pagos.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando el carrito...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        Tu Carrito de Compras
      </Typography>

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="textSecondary">
            Tu carrito está vacío.
          </Typography>
        </Box>
      ) : (
        <Card sx={{ mt: 4, padding: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumen de tu carrito
            </Typography>
            <List>
              {cartItems.map((item) => (
                <React.Fragment key={item.courseID}>
                  <ListItem sx={{ alignItems: 'flex-start' }}>
                    <ListItemText
                      primary={`Curso: ${item.courseID}`}
                      secondary="Descripción breve del curso"
                      primaryTypographyProps={{
                        fontWeight: 'bold',
                        fontSize: '1rem',
                      }}
                      secondaryTypographyProps={{
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                      }}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleRemoveFromCart(item.courseID)}
                      >
                        Eliminar
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Total de cursos: {cartItems.length}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Comprar'}
            </Button>
          </CardActions>
        </Card>
      )}

      {purchaseStatus && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">{purchaseStatus}</Alert>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
