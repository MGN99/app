// src/components/MainPage/CartPage.jsx
import React, { useEffect, useState } from 'react';
import { getCartByUsername, removeFromCart } from '../MainPage/CartService';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el nombre de usuario del almacenamiento local o de un estado global
  const username = localStorage.getItem('username'); // Ajusta esto según tu lógica

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await getCartByUsername(username);
        setCartItems(data || []); // Ajusta esto según la estructura de tu respuesta
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCartItems();
    } else {
      setError('No se encontró el nombre de usuario.');
      setLoading(false);
    }
  }, [username]);

  const handleRemoveFromCart = async (courseID) => {
    try {
      await removeFromCart(username, courseID);
      // Actualiza el estado después de eliminar el curso
      setCartItems((prevItems) => prevItems.filter(item => item.courseID !== courseID));
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
                primary={item.title} // Cambia esto según cómo obtengas el título
                secondary={`Cantidad: ${item.quantity} - Precio: $${item.price}`} // Ajusta la estructura según tu respuesta
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
