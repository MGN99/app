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
import { useNavigate } from 'react-router-dom'; // Importar el hook
import useCartStore from './CartStore';
import axios from 'axios';

const CartPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const [courses, setCourses] = useState({}); // Estado para almacenar los nombres de los cursos
  const email = localStorage.getItem('email');
  const { cartItems, removeFromCart: removeItemFromStore } = useCartStore();
  const navigate = useNavigate(); // Inicializar el hook

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!email) return;

      setLoading(true);
      try {
        const data = await viewCartByEmail(email);
        if (data) {
          useCartStore.setState({ cartItems: data });
          await fetchCourseNames(data); // Fetch the course names when cart items are loaded
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [email]);

  const fetchCourseNames = async (cartItems) => {
    const courseRequests = cartItems.map(async (item) => {
      const response = await axios.post('http://localhost:8081/graphql', {
        query: `
          query {
            cursoByID(courseID: ${item.courseID}) {
              title
            }
          }
        `,
      });
      return { courseID: item.courseID, title: response.data.data.cursoByID.title };
    });

    // Esperamos a que todas las peticiones terminen y luego actualizamos el estado
    const courseData = await Promise.all(courseRequests);
    const courseNames = courseData.reduce((acc, { courseID, title }) => {
      acc[courseID] = title;
      return acc;
    }, {});
    setCourses(courseNames);
  };

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
                      primary={`Curso: ${courses[item.courseID] || 'Cargando...'}`}
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

      {/* Botón para regresar a la página principal */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button variant="outlined" color="primary" onClick={() => navigate('/')}>
          Volver a la Página Principal
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;
