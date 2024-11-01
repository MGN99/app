import React, { useEffect, useState } from 'react';
import { viewCartByUsername, removeFromCart } from '../MainPage/CartService';
import { Button, Typography, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const username = localStorage.getItem('username'); // Ajusta esto según tu lógica

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const data = await viewCartByUsername(username);
        
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
      const message = await removeFromCart(courseID);
      setCartItems((prevItems) => prevItems.filter(item => item.courseID !== courseID));
      
      // Si deseas mostrar el mensaje de éxito, puedes agregarlo a un estado de mensaje aquí
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
