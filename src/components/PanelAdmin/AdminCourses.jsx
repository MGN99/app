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
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:8081/graphql'; // Cambia esto a la URL de tu API

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    instructorID: '',
    title: '',
    description: '',
    price: '',
    category: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
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
      // Asegúrate de que estás accediendo a la ruta correcta en la respuesta
      console.log(response.data); // Agrega este console.log para depurar
      setCourses(response.data.data.cursos || []); // Maneja el caso donde no haya cursos
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error al obtener los cursos.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (course) => {
    console.log('ID del curso a eliminar:', course.courseID); // Agrega esto
    try {
        const response = await axios.post(API_URL, {
            query: `
                mutation {
                    deleteCurso(courseID: "${course.courseID}") 
                }
            `
        });

        const { data } = response;
        if (data.errors) {
            setError(data.errors[0].message);
            return;
        }

        if (data.data.deleteCurso) {
            setCourses((prevCourses) => prevCourses.filter(c => c.courseID !== course.courseID));
            setOpenDeleteModal(false);
        } else {
            setError('Error al eliminar el curso.');
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        setError('Error al eliminar el curso.');
    }
};


  const handleCreateCourse = async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            createCurso(
              instructorID: "${newCourse.instructorID}",
              title: "${newCourse.title}",
              description: "${newCourse.description}",
              price: ${newCourse.price},
              category: "${newCourse.category}"
            ) {
              courseID
              title
              instructorID
              description
              price
              category
            }
          }
        `
      });

      const { data } = response;
      if (data.errors) {
        setError(data.errors[0].message);
        return;
      }

      setCourses((prevCourses) => [...prevCourses, data.data.createCurso]);
      setOpenCreateModal(false);
      setNewCourse({
        instructorID: '',
        title: '',
        description: '',
        price: '',
        category: ''
      });
    } catch (error) {
      console.error('Error creating course:', error);
      setError('Error al crear el curso.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <h1>Courses</h1>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
          sx={{ width: '300px' }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: '#000' }}
          onClick={() => setOpenCreateModal(true)}
        >
          Create Course
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Instructor ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.courseID}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.instructorID}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>${course.price.toFixed(2)}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      console.log('Curso seleccionado para eliminar:', course);
                      setSelectedCourse(course);
                      console.log('Curso seleccionado:', course);
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
          <Typography variant="body1">Are you sure you want to delete this course?</Typography>
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={() => handleDelete(selectedCourse)}>Confirm</Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)} sx={{ marginLeft: 2 }}>Cancel</Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for Creating a New Course */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 400 }}>
          <Typography variant="h6">Create Course</Typography>
          <TextField
            label="Instructor ID"
            variant="outlined"
            fullWidth
            value={newCourse.instructorID}
            onChange={(e) => setNewCourse({ ...newCourse, instructorID: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            fullWidth
            value={newCourse.price}
            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={newCourse.category}
            onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleCreateCourse}>Create</Button>
            <Button variant="outlined" onClick={() => setOpenCreateModal(false)} sx={{ marginLeft: 2 }}>Cancel</Button>
          </Box>
          {error && (
            <Typography sx={{ color: 'error.main', mt: 2 }} variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
