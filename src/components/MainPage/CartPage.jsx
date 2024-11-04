import React, { useEffect, useState } from 'react';
import { viewCartByEmail, removeFromCart } from '../MainPage/CartService';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import useCartStore from './CartStore'; // Ajusta la ruta según tu estructura
import axios from 'axios';

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState(''); // Estado para mostrar el mensaje de compra
  const email = localStorage.getItem('email'); // Usamos el email actual
  const { cartItems, removeFromCart: removeItemFromStore } = useCartStore();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!email) return; // Si no hay usuario, no cargar nada

      setLoading(true); // Activar el loading al cargar nuevos datos

      try {
        const data = await viewCartByEmail(email);
        if (data) {
          // Actualizar el carrito en Zustand con los datos recibidos del backend
          useCartStore.setState({ cartItems: data });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems(); // Llamar cada vez que `email` cambie
  }, [email]);

  const handleRemoveFromCart = async (courseID) => {
    try {
      await removeFromCart(courseID);
      removeItemFromStore(courseID); // Remover del estado de Zustand usando la función original
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

      // Verificar si la respuesta contiene la URL de redirección
      if (response.data && response.data.url) {
        window.location.href = response.data.url; // Redirigir a la URL de Webpay
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
    return <Typography variant="h6">Cargando el carrito...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tu Carrito de Compras
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body1">Tu carrito está vacío.</Typography>
      ) : (
        <List>
          {cartItems.map(item => (
            <ListItem key={item.courseID}>
              <ListItemText
                primary={`Curso ID: ${item.courseID}`} // Cambia esto según cómo obtengas el título
              />
              <ListItemSecondaryAction>
                <Button variant="outlined" color="secondary" onClick={() => handleRemoveFromCart(item.courseID)}>
                  Eliminar
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {/* Botón de Comprar */}
      {cartItems.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handlePurchase}
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? 'Procesando...' : 'Comprar'}
        </Button>
      )}

      {/* Mostrar el estado de la compra */}
      {purchaseStatus && (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          {purchaseStatus}
        </Typography>
      )}
    </div>
  );
};

export default CartPage;
