import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Box,
  Modal,
  Typography,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:8080/graphql'; // Cambia esto a la URL de tu API

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          query {
            getAllUsers {
              userID
              nameLastName
              username
              email
              role
            }
          }
        `,
      });
      console.log(response.data); // Agrega este console.log para depurar
      setUsers(response.data.data.getAllUsers || []); // Maneja el caso donde no haya usuarios
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error al obtener los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.nameLastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteUserByUsername = async (username) => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            deleteUserByUsername(username: "${username}") 
          }
        `,
      });
  
      const { data } = response;
  
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
  
      if (data.data.deleteUserByUsername) {
        return data.data.deleteUserByUsername; // Retorna el mensaje de éxito si es necesario
      } else {
        throw new Error('Error al eliminar el usuario.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  };

  const handleDelete = async (user) => {
    console.log('usuario a eliminar:', user.username); // Agrega esto
    try {
        const response = await axios.post(API_URL, {
            query: `
                mutation {
                    deleteUserByUsername(username: "${user.username}") 
                }
            `,
        });

        const { data } = response;

        // Manejo de errores
        if (data.errors) {
            setError(data.errors[0].message);
            return;
        }

        // Verifica si la eliminación fue exitosa
        if (data.data.deleteUserByUsername) {
            setUsers((prevUsers) => prevUsers.filter(u => u.username !== user.username));
            setOpenDeleteModal(false); // Cierra el modal después de eliminar
        } else {
            setError('Error al eliminar el usuario.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        setError('Error al eliminar el usuario.');
    }
};
  return (
    <Box sx={{ padding: 3 }}>
      <h1>Users</h1>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          sx={{ width: '300px' }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.userID}>
                  <TableCell>{user.nameLastName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  
                  <TableCell>
                    
                    <IconButton onClick={() => {
                      console.log('Usuario seleccionado para eliminar:', user);
                      setSelectedUser(user);
                      setOpenDeleteModal(true);
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Confirming Deletion */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 400 }}>
          <Typography variant="h6">Confirm Delete</Typography>
          <Typography variant="body1">Are you sure you want to delete this user?</Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleDelete(selectedUser)}>Confirm</Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ marginLeft: 2 }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
