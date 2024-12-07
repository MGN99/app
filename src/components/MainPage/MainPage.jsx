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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import CourseCard from '../PanelUser/CourseCard';
import useCartStore from '../MainPage/CartStore';


const API_URL = 'http://localhost:8081/graphql';
const API_URL2 = 'http://localhost:8080/graphql';

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [email, setUserEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const { cartItems, addToCartbyEmail, fetchCartItems, clearCart } = useCartStore();

  useEffect(() => {
    const email = localStorage.getItem('email');
    const storedUsername = localStorage.getItem('username');
    if (email) {
      setUserEmail(email);
      fetchCartItems(email); // Cargar el carrito desde el backend al iniciar sesión
    }
    if (storedUsername) {
      setUsername(storedUsername);
    }
    fetchCourses(); // Llama a la función para obtener cursos
    console.log('Stored username from localStorage:', storedUsername);
    console.log('Stored email from localStorage:', email);
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        query: `
          query {
            cursos {
              courseID
              instructorName
              title
              description
              price
              category
              imageURL
            }
          }
        `,
      });
      setCourses(response.data.data.cursos || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    clearCart(); // Limpiar el carrito al cerrar sesión
    setUserEmail(null);
    setUsername(null);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
    console.log('Selected course:', course);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  const handleaddToCartbyEmail = async () => {
    if (!email || !selectedCourse)
      return;

    try {
      console.log("Iniciando proceso para añadir al carrito...");

      // Realizar la mutación en el backend
      const response = await axios.post(API_URL2, {
        query: `
          mutation {
            addToCartbyEmail(email: "${email}", courseID: "${selectedCourse.courseID}") {
              cartID
              userID
              courseID
            }
          }
        `
      });

      if (response.data.errors) {
        console.error("Error en la mutación:", response.data.errors);
        return;
      }

      // Añadir al carrito en el estado global
      addToCartbyEmail({ ...selectedCourse, quantity: 1 });

      setIsModalOpen(false); // Cerrar el modal
      console.log("Curso añadido al carrito:", selectedCourse);
      
    } catch (error) {
      alert(error);
      console.error('Error al añadir el curso al carrito:', error);
    }
    
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

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#f0f4f8', // Color de fondo suave
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    outline: 'none',
  };

  return (
    <div>
      {/* Header */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #2196f3 0%, #4caf50 100%)',
          borderBottom: '1px solid #d0d0d0',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', paddingX: 3 }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#fff' }}>
            ένας
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Buscar cualquier cosa"
              size="small"
              sx={{
                width: '400px',
                backgroundColor: '#fff',
                borderRadius: '20px',
                boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #ccc',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#ccc',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4caf50',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4caf50',
                  },
                },
              }}
            />
            {email ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Typography variant="body1" sx={{ mr: 2, color: '#fff' }}>
                  Bienvenido, {email}
                </Typography>
                <Badge
                  badgeContent={cartItems.length}
                  color="secondary"
                  sx={{
                    '& .MuiBadge-badge': {
                      top: 10,
                      right: -5,
                      backgroundColor: '#ff5722',
                      color: '#fff',
                    },
                  }}
                >
                  <Link to="/cart">
                    <ShoppingCartIcon sx={{ cursor: 'pointer', color: '#fff' }} />
                  </Link>
                </Badge>
                {/* Botón de acceso al Panel */}
                <Button
                  color="primary"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    minWidth: 'auto',
                    backgroundColor: '#81c784',
                    color: '#fff',
                    padding: '6px',
                    borderRadius: '50%',
                    '&:hover': { backgroundColor: '#66bb6a' },
                  }}
                >
                  <AccountCircleIcon />
                </Button>
                <Button
                  color="primary"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: '#81c784',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#66bb6a' },
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
                    borderColor: '#81c784',
                    color: '#fff',
                    borderRadius: '20px',
                    '&:hover': { backgroundColor: 'rgba(129, 199, 132, 0.1)', borderColor: '#66bb6a' },
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
                    borderRadius: '20px',
                    '&:hover': { backgroundColor: '#43a047' },
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom color="#2e7d32">
          Cursos de Desarrollo
        </Typography>
        <Typography variant="body1" color="#4caf50" gutterBottom>
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
                  instructor={course.instructorName}
                  imageURL={course.imageURL}
                  onClick={() => handleCourseClick(course)}
                  sx={{
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    },
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Modal for course details */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" color="#2e7d32">
            {selectedCourse?.title}
          </Typography>
          <Typography sx={{ mt: 2 }} color="#555">
            {selectedCourse?.description}
          </Typography>
          <Typography sx={{ mt: 2 }} color="#4caf50">
            Precio: ${selectedCourse?.price}
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleaddToCartbyEmail(selectedCourse)}
            sx={{ mt: 2, borderRadius: '20px' }}
          >
            Añadir al carrito
          </Button>
        </Box>
      </Modal>
      <Outlet />
    </div>
  );
};

export default MainPage;
