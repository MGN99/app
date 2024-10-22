import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Grid,
  Modal,
  Box,
  Container,
  Badge,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import CourseCard from '../PanelUser/CourseCard'; // Asegúrate de que la ruta sea correcta
import useCartStore from '../MainPage/CartStore';

const API_URL = 'http://localhost:8081/graphql'; // Cambia esto a la URL de tu API

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { cartItems, addToCart } = useCartStore(); // Usar el store

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
    fetchCourses(); // Llama a la función para obtener cursos
  }, []);

  const fetchCourses = async () => {
    setLoading(true); // Establecer loading en true al inicio
    try {
      const response = await axios.post(API_URL, {
        query: `
          query {
            cursos {
              courseID
              instructorID
              title
              description
              price
              category
            }
          }
        `
      });
      setCourses(response.data.data.cursos || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false); // Cambiar loading a false al final
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    setUserEmail(null);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleAddToCart = () => {
    addToCart(selectedCourse); // Usar la función de añadir al carrito
    setIsModalOpen(false);
  };

  const filteredCourses = courses
    .filter((course) => {
      if (selectedCategory === '') return true;
      return course.category === selectedCategory;
    })
    .sort((a, b) => {
      if (priceOrder === 'asc') return parseFloat(a.price) - parseFloat(b.price);
      if (priceOrder === 'desc') return parseFloat(b.price) - parseFloat(a.price);
      return 0;
    });

  // Estilos para el modal
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    outline: 'none',
  };

  return (
    <div>
      {/* Header */}
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #f5f5f5 0%, #eaeaea 100%)',
          borderBottom: '1px solid #d0d0d0',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', paddingX: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
            ένας
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar cualquier cosa"
              size="small"
              sx={{
                width: '400px',
                backgroundColor: '#f9f9f9',
                borderRadius: '20px',
                boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
              }}
            />
            {userEmail ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Welcome, {userEmail}
                </Typography>
                <Badge
                  badgeContent={cartItems.length} // Cambiar a length para mostrar la cantidad
                  color="secondary"
                  sx={{ 
                    '& .MuiBadge-badge': { 
                      top: 10, 
                      right: -5 
                    } 
                  }}
                >
                  <Link to="/cart">
                    <ShoppingCartIcon sx={{ cursor: 'pointer' }} />
                  </Link>
                </Badge>
                <Button
                  color="primary"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: '#e0e0e0',
                    color: '#333',
                    '&:hover': { backgroundColor: '#d4d4d4' },
                  }}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{
                    mr: 1,
                    borderColor: '#9c9c9c',
                    color: '#555',
                    '&:hover': { backgroundColor: '#f0f0f0', borderColor: '#aaa' },
                  }}
                >
                  Login
                </Button>
                <Button
                  color="success"
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#45a047' },
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Tabs for category navigation */}
      <Tabs
        value={false}
        centered
        sx={{
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
          '& .MuiTab-root': {
            minWidth: 'auto',
            paddingX: 4,
            fontWeight: 500,
            fontFamily: 'Arial, sans-serif',
            '&:hover': { color: '#3f51b5' },
          },
        }}
      >
        <Tab label="Desarrollo web" />
        <Tab label="Ciencias de la información" />
        <Tab label="Desarrollo móvil" />
        <Tab label="Lenguajes de programación" />
        <Tab label="Testeo de software" />
      </Tabs>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Cursos de Desarrollo
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Cursos para dar tus primeros pasos. Descubre cursos de expertos experimentados del mundo real.
        </Typography>

        {/* Course List */}
        <Grid container spacing={3}>
          {loading ? (
            <Typography variant="body1">Cargando cursos...</Typography>
          ) : (
            filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.courseID}>
                <CourseCard
                  title={course.title}
                  instructor={course.instructorID} // Cambia esto si es necesario
                  progress={50} // Cambia esto según tu lógica para mostrar el progreso
                  onClick={() => handleCourseClick(course)} // Llama a la función al hacer clic
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Modal for course details */}
      {selectedCourse && (
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom>
              {selectedCourse.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {selectedCourse.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Precio: ${selectedCourse.price}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Agregar al Carrito
            </Button>
            <Button variant="outlined" onClick={closeModal}>
              Cerrar
            </Button>
          </Box>
        </Modal>
      )}

      <Outlet /> {/* Renderiza las rutas hijas aquí */}
    </div>
  );
};

export default MainPage;
