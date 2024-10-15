import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Modal,
  Box,
  Container,
} from '@mui/material';
import courses from '../PanelUser/Coursesdata'; // Importar los datos de los cursos

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

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
              <div>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Welcome, {userEmail}
                </Typography>
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
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
                onClick={() => handleCourseClick(course)}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image="https://via.placeholder.com/150" // Placeholder de imagen
                  alt={course.title}
                />
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Modal for course details */}
      {isModalOpen && selectedCourse && (
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box sx={{ p: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 500 }}>
            <Typography variant="h5">{selectedCourse.title}</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {selectedCourse.description}
            </Typography>
            <Button variant="contained" onClick={closeModal} sx={{ mt: 4 }}>
              Cerrar
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default MainPage;