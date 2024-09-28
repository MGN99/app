import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import courses from '../PanelUser/Coursesdata'; // Importa los datos

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null); // Estado para el curso seleccionado
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

  // Obtener el email del localStorage al cargar la página
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

  // Maneja la apertura del modal con los detalles del curso
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Cierra el modal
  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  // Filtrar y ordenar cursos
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
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <h1>ένας</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar cualquier cosa"
            className="search-bar"
          />
        </div>
        <div className="user-info">
          {userEmail ? (
            <div>
              <span>Welcome, {userEmail}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </header>

      {/* Contenido principal */}
      <main>
        <h2>Cursos Disponibles</h2>
        <div className="filters">
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Todas las Categorías</option>
            {/* Añade más opciones según las categorías disponibles */}
          </select>
          <select onChange={(e) => setPriceOrder(e.target.value)}>
            <option value="">Ordenar por Precio</option>
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div className="course-list">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="course-item"
              onClick={() => handleCourseClick(course)}
            >
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Precio: {course.price}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal para mostrar detalles del curso */}
      {isModalOpen && selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <h3>{selectedCourse.title}</h3>
            <p>{selectedCourse.description}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
