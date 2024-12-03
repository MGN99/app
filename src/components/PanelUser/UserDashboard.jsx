import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Pagination,
  Box,
  CssBaseline,
  Divider,
  Container,
} from '@mui/material';
import { Home, Person, Settings, ArrowBack } from '@mui/icons-material'; // Importar íconos
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';

// Configuración de URL de la API
const API_URL = 'http://localhost:8080/graphql';

// Ancho de la barra lateral
const drawerWidth = 300;

const UserDashboard = () => {
  const [currentSection, setCurrentSection] = useState('courses');
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [courseDetails, setCourseDetails] = useState({});  // Estado para almacenar los detalles de los cursos (incluido instructor)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const coursesPerPage = 4;

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      fetchCourses(email);
    }
  }, []);

  // Función para obtener el nombre del curso y el nombre del instructor
  const fetchCourseDetails = async (courseID) => {
    try {
      const response = await axios.post('http://localhost:8081/graphql', {
        query: `
          query {
            cursoByID(courseID: ${courseID}) {
              title
              instructorName
            }
          }
        `,
      });
      return {
        title: response.data.data.cursoByID?.title || "Unknown Course",
        instructorName: response.data.data.cursoByID?.instructorName || "Unknown Instructor",
      };
    } catch (error) {
      console.error('Error al obtener los detalles del curso:', error);
      return { title: "Error al obtener el nombre", instructorName: "Error al obtener el instructor" };
    }
  };

  // Función para obtener los cursos
  const fetchCourses = async (email) => {
    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        query: `
          query {
            getCoursesByEmail(email: "${email}") {
              id
              email
              courseID
            }
          }
        `,
      });

      const fetchedCourses = response.data.data.getCoursesByEmail || [];
      setCourses(fetchedCourses);

      // Obtener los detalles de los cursos (nombre y instructor)
      const details = {};
      for (const course of fetchedCourses) {
        const courseDetailsData = await fetchCourseDetails(course.courseID);
        details[course.courseID] = courseDetailsData;
      }
      setCourseDetails(details);  // Actualiza los detalles de los cursos en el estado
    } catch (error) {
      console.error('Error al obtener los cursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  const renderCourses = () => (
    <>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Courses
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.courseID}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="primary">
                      Course: {courseDetails[course.courseID]?.title || "Loading..."} {/* Muestra el nombre del curso */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {courseDetails[course.courseID]?.instructorName || "Loading..."} {/* Muestra el nombre del instructor */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </>
  );

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'courses':
        return renderCourses();
      case 'profile':
        return <UserProfile />;
      case 'settings':
        return <UserSettings />;
      default:
        return <Typography variant="h5">My Courses</Typography>;
    }
  };

  const sections = [
    { id: 'courses', label: 'Courses', icon: <Home /> },
    { id: 'profile', label: 'Profile', icon: <Person /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Barra superior */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            User Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Barra lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#162447',
            color: '#ffffff',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {sections.map((section) => (
            <ListItem
              button
              key={section.id}
              onClick={() => setCurrentSection(section.id)}
              selected={currentSection === section.id}
              sx={{
                '&.Mui-selected': { backgroundColor: '#1f4068' },
                '&:hover': { backgroundColor: '#1f4068' },
              }}
            >
              <ListItemIcon sx={{ color: '#ffffff' }}>{section.icon}</ListItemIcon>
              <ListItemText primary={section.label} />
            </ListItem>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} /> {/* Espacio para empujar el botón de volver al final */}
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => navigate('/')}
            sx={{
              backgroundColor: '#e63946',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#d62828' },
            }}
          >
            <ListItemIcon sx={{ color: '#ffffff' }}>
              <ArrowBack />
            </ListItemIcon>
            <ListItemText primary="Return to MainPage" />
          </ListItem>
        </List>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Container>{renderSectionContent()}</Container>
      </Box>
    </Box>
  );
};

export default UserDashboard;
