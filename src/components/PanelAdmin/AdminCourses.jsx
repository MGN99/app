import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Button, Box, Modal, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const API_URL = 'http://localhost:8081/graphql';

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
      setCourses(response.data.data.cursos || []);
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

  const handleDelete = async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            deleteCursoByID(courseID: ${selectedCourse.courseID})
          }
        `
      });
      if (response.data.data.deleteCursoByID) {
        setCourses((prevCourses) => prevCourses.filter(c => c.courseID !== selectedCourse.courseID));
        setOpenDeleteModal(false);
        setSelectedCourse(null);
      } else {
        setError('Error al eliminar el curso.');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      setError('Error al eliminar el curso.');
    }
  };

  const handleEditCourse = async () => {
    try {
      const response = await axios.post(API_URL, {
        query: `
          mutation {
            updateCursoByID(
              courseID: ${selectedCourse.courseID},
              title: "${selectedCourse.title}",
              description: "${selectedCourse.description}",
              price: ${selectedCourse.price},
              category: "${selectedCourse.category}"
            ) {
              courseID
              title
              description
              price
              category
            }
          }
        `
      });

      if (response.data.data.updateCursoByID) {
        setCourses((prevCourses) =>
          prevCourses.map((c) =>
            c.courseID === selectedCourse.courseID ? response.data.data.updateCursoByID : c
          )
        );
        setOpenEditModal(false);
        setSelectedCourse(null);
      } else {
        setError('Error al actualizar el curso.');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      setError('Error al actualizar el curso.');
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
              description
              price
              category
            }
          }
        `
      });

      if (response.data.data.createCurso) {
        setCourses((prevCourses) => [...prevCourses, response.data.data.createCurso]);
        setOpenCreateModal(false);
        setNewCourse({ instructorID: '', title: '', description: '', price: '', category: '' });
      } else {
        setError('Error al crear el curso.');
      }
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
                  <TableCell>{course.description}</TableCell>
                  <TableCell>${course.price.toFixed(2)}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setSelectedCourse(course);
                      setOpenEditModal(true);
                    }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                      setSelectedCourse(course);
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

      {/* Modal for Editing Course */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 400 }}>
          <Typography variant="h6">Edit Course</Typography>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={selectedCourse?.title || ''}
            onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={selectedCourse?.description || ''}
            onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            fullWidth
            value={selectedCourse?.price || ''}
            onChange={(e) => setSelectedCourse({ ...selectedCourse, price: parseFloat(e.target.value) })}
            sx={{ marginBottom: 2 }}
            required
          />
          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={selectedCourse?.category || ''}
            onChange={(e) => setSelectedCourse({ ...selectedCourse, category: e.target.value })}
            sx={{ marginBottom: 2 }}
            required
          />
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleEditCourse}>Save</Button>
            <Button variant="outlined" onClick={() => setOpenEditModal(false)} sx={{ marginLeft: 2 }}>Cancel</Button>
          </Box>
          {error && (
            <Typography sx={{ color: 'error.main', mt: 2 }} variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Modal for Deleting Course */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 400, textAlign: 'center' }}>
          <Typography variant="h6">Confirm Delete</Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete the course "{selectedCourse?.title}"?
          </Typography>
          <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          </Box>
          {error && (
            <Typography sx={{ color: 'error.main', mt: 2 }} variant="body2">
              {error}
            </Typography>
          )}
        </Box>
      </Modal>

      {/* Modal for Creating Course */}
<Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
  <Box sx={{ padding: 4, backgroundColor: 'white', margin: 'auto', maxWidth: 400 }}>
    <Typography variant="h6">Create New Course</Typography>
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
      onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
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
