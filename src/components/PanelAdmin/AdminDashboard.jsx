import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the exit icon
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AdminCourses from './AdminCourses';
import AdminUsers from './AdminUsers';

// Datos de ejemplo para el gráfico
const data = [
  { name: 'Jan', users: 120 },
  { name: 'Feb', users: 200 },
  { name: 'Mar', users: 150 },
  { name: 'Apr', users: 300 },
  { name: 'May', users: 280 },
];

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState('dashboard');

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return (
          <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Admin Panel
            </Typography>
            <Typography variant="h6">Bienvenido al Panel de Administración</Typography>

            {/* Usando Grid para layout responsivo */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Tarjeta 1 */}
              <Grid item xs={12} md={4}>
                <Card sx={{ minHeight: 150 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Total de Usuarios
                    </Typography>
                    <Typography variant="h4" color="primary">
                      200
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tarjeta 2 */}
              <Grid item xs={12} md={4}>
                <Card sx={{ minHeight: 150 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Cursos Activos
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      50
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Tarjeta 3 */}
              <Grid item xs={12} md={4}>
                <Card sx={{ minHeight: 150 }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Comentarios Pendientes
                    </Typography>
                    <Typography variant="h4" color="error">
                      10
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Sección de gráfico */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Crecimiento de Usuarios
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
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
    // Implement your logout logic here
    console.log('Logging out...');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
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

        {/* Logout button */}
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

      {/* Contenido dinámico */}
      <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
