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



      {/* Main Section */}
      <section className="main-section">
        <h2>Cursos de Desarrollo</h2>
        <p>Cursos para dar tus primeros pasos</p>
        <p>Descubre cursos de expertos experimentados del mundo real.</p>

      </section>
    </div>
  );
};

export default MainPage;
