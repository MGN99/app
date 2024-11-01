import React, { useEffect, useState } from 'react';
import { viewCartByEmail, removeFromCart } from '../MainPage/CartService';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import useCartStore from './CartStore'; // Ajusta la ruta según tu estructura

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const email = localStorage.getItem('email'); // Usamos el email actual
  const { cartItems, addToCartbyEmail, removeFromCart: removeItemFromStore } = useCartStore();

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
    </div>
  );
};

export default CartPage;
