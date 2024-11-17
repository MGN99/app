import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TextField, Button, Box, Modal, Typography, CircularProgress
} from '@mui/material';
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
    instructorName: '',
    title: '',
    description: '',
    price: '',
    category: '',
    imageURL: '',
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
        `,
      });
      if (response.data.data.deleteCursoByID) {
        setCourses((prevCourses) => prevCourses.filter((c) => c.courseID !== selectedCourse.courseID));
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
              category: "${selectedCourse.category}",
              imageURL: "${selectedCourse.imageURL}"
            ) {
              courseID
              title
              description
              price
              category
              imageURL
              instructorName
            }
          }
        `,
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
              title: "${newCourse.title}",
              description: "${newCourse.description}",
              price: ${newCourse.price},
              category: "${newCourse.category}",
              imageURL: "${newCourse.imageURL}",
              instructorName: "${newCourse.instructorName}"
            ) {
              courseID
              title
              description
              price
              category
              imageURL
              instructorName
            }
          }
        `
      });
  
      if (response.data.data.createCurso) {
        setCourses((prevCourses) => [...prevCourses, response.data.data.createCurso]);
        setOpenCreateModal(false);
        setNewCourse({ 
          title: '', 
          description: '', 
          price: '', 
          category: '', 
          imageURL: '', 
          instructorName: '' 
        });
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
                <TableCell>Instructor</TableCell>
                <TableCell>Image</TableCell>
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
                  <TableCell>{course.instructorName}</TableCell>
                  <TableCell>
                    <img src={course.imageURL} alt={course.title} style={{ width: '50px' }} />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpenEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedCourse(course);
                        setOpenDeleteModal(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Creating Course */}
      <Modal
  open={openCreateModal}
  onClose={() => setOpenCreateModal(false)}
  aria-labelledby="modal-create-course"
>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
    }}
  >
    <Typography id="modal-create-course" variant="h6" component="h2">
      Create New Course
    </Typography>
    <TextField
      fullWidth
      label="Title"
      value={newCourse.title}
      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Description"
      value={newCourse.description}
      onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Price"
      type="number"
      value={newCourse.price}
      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Category"
      value={newCourse.category}
      onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Image URL"
      value={newCourse.imageURL}
      onChange={(e) => setNewCourse({ ...newCourse, imageURL: e.target.value })}
      margin="normal"
    />
    {newCourse.imageURL && (
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <img
          src={newCourse.imageURL}
          alt="Preview"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '200px',
            objectFit: 'contain',
            border: '1px solid #ccc',
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150'; // Default image in case of error
          }}
        />
      </Box>
    )}
    <TextField
      fullWidth
      label="Instructor Name"
      value={newCourse.instructorName}
      onChange={(e) => setNewCourse({ ...newCourse, instructorName: e.target.value })}
      margin="normal"
    />
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Button variant="contained" color="primary" onClick={handleCreateCourse}>
        Create
      </Button>
      <Button variant="outlined" onClick={() => setOpenCreateModal(false)}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>


      {/* Modal for Editing Course */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="modal-edit-course"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-edit-course" variant="h6" component="h2">
            Edit Course
          </Typography>
          {selectedCourse && (
            <>
              <TextField
                fullWidth
                label="Title"
                value={selectedCourse.title}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, title: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={selectedCourse.description}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, description: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={selectedCourse.price}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, price: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Category"
                value={selectedCourse.category}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, category: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Image URL"
                value={selectedCourse.imageURL}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, imageURL: e.target.value })
                }
                margin="normal"
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="primary" onClick={handleEditCourse}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setOpenEditModal(false)}>
                  Cancel
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal for Deleting Course */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="modal-delete-course"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-delete-course" variant="h6" component="h2">
            Delete Course
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete the course{' '}
            <strong>{selectedCourse?.title}</strong>?
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
            <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
