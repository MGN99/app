import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import courses from './Coursesdata'; // Importa los datos

const MainPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [userEmail, setUserEmail] = useState(null);

  // Obtener el email del localStorage al cargar la página
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleLogout = () => {
    // Elimina el email y token de localStorage
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    setUserEmail(null); // Actualiza el estado para ocultar el email
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

      {/* Filter Section (sección actualizada) */}
      <div className="filter-section">
        {/* Filtro por tipo (categoría) */}
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

        {/* Filtro por precio */}
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
              <div key={course.id} className="course-card">
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
    </div>
  );
};

export default MainPage;
