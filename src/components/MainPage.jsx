import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import courses from './Coursesdata'; // Importa los datos

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
    .filter(course => {
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
        <div className="nav-buttons">
          {userEmail ? (
            <div className="user-info">
              <span className="user-email">{userEmail}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn register-btn">Register</Link>
            </>
          )}
        </div>
      </header>

      {/* Filter Section */}
      <div className="filter-section">
        <label htmlFor="categoryFilter">Filtrar por tipo:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="Programación">Programación</option>
          <option value="Cocina">Cocina</option>
          <option value="Música">Música</option>
        </select>

        <label htmlFor="priceOrder">Ordenar por precio:</label>
        <select
          id="priceOrder"
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="asc">Menor a mayor</option>
          <option value="desc">Mayor a menor</option>
        </select>
      </div>

      {/* Main Section */}
      <section className="main-section">
        <h2>Cursos de Desarrollo</h2>
        <p>Cursos para dar tus primeros pasos</p>
        <p>Descubre cursos de expertos experimentados del mundo real.</p>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="course-card" onClick={() => handleCourseClick(course)}>
                <img src={course.imageUrl} alt={course.title} className="course-image" />
                <h3>{course.title}</h3>
                <p>{course.instructor}</p>
                <p className="price">{course.price}</p>
                <p className="discounted-price">{course.discountedPrice}</p>
              </div>
            ))
          ) : (
            <p>No se encontraron cursos para esta categoría.</p>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedCourse.title}</h2>
            <p>Profesor: {selectedCourse.instructor}</p>
            <p>Precio: {selectedCourse.price}</p>
            <p>Descripción: {selectedCourse.description}</p>
            <button className="add-to-cart-button">Agregar al carrito</button>
            <button className="close-modal-button" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
