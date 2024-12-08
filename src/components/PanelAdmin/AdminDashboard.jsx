import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import AdminCourses from './AdminCourses';
import AdminUsers from './AdminUsers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Asegúrate de tener esto importado

const API_URL = 'http://localhost:8080/graphql';
const API_URL2 = 'http://localhost:8081/graphql';

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook de navegación

  // Función para obtener los cursos
  const fetchCourses = async () => {
    try {
      const response = await axios.post(API_URL2, {
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
      setError('Error al obtener los cursos.');
    } finally {
      setLoadingCourses(false);
    }
  };

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `query {
            getAllUsers {
              userID
              nameLastName
              username
              email
              role
            }
          }`,
      });
      setUsers(response.data.data.getAllUsers || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al obtener los usuarios.');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  // Cálculo de totales
  const totalUsers = users.length;
  const totalCourses = courses.length;

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return (
          <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Admin Panel
            </Typography>
            <Typography variant="h6">Bienvenido al Panel de Administración</Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Tarjeta de Total de Usuarios */}
              <Grid item xs={12} md={4}>
                <Card sx={{ minHeight: 150 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Total de Usuarios
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {loadingUsers ? 'Cargando...' : totalUsers}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tarjeta de Cursos Activos */}
              <Grid item xs={12} md={4}>
                <Card sx={{ minHeight: 150 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Cursos Activos
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {loadingCourses ? 'Cargando...' : totalCourses}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      case 'courses':
        return <AdminCourses />;
      case 'users':
        return <AdminUsers />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    // Limpiar datos de autenticación (por ejemplo, token en localStorage o sessionStorage)
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    
    // Redirigir al login
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ padding: 2, textAlign: 'center' }}>
          <Typography variant="h6">ένας Admin</Typography>
        </Box>
        <List>
          <ListItem button onClick={() => setSelectedView('dashboard')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => setSelectedView('courses')}>
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText primary="Courses" />
          </ListItem>
          <ListItem button onClick={() => setSelectedView('users')}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        </List>

        <Box sx={{ marginTop: 'auto', padding: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
