import React from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
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
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn register-btn">Register</Link>
        </div>
      </header>

      {/* Categories Tabs */}
      <nav className="categories-nav">
        <Link to="#" className="category">Desarrollo web</Link>
        <Link to="#" className="category">Ciencias de la información</Link>
        <Link to="#" className="category">Desarrollo móvil</Link>
        <Link to="#" className="category">Lenguajes de programación</Link>
        <Link to="#" className="category">Testeo de software</Link>
      </nav>

      {/* Main Section */}
      <section className="main-section">
        <h2>Cursos de Desarrollo</h2>
        <p>Cursos para dar tus primeros pasos</p>
        <p>Descubre cursos de expertos experimentados del mundo real.</p>

        {/* Tabs for filtering */}
        <div className="tabs-container">
          <button className="tab-btn active">Más populares</button>
          <button className="tab-btn">Nuevo</button>
          <button className="tab-btn">Populares</button>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          <div className="course-card">
            <img src="https://via.placeholder.com/150" alt="Course" className="course-image" />
            <h3>Introducción a JavaScript</h3>
            <p>Carlos Solis</p>
            <p className="price">9.990 CLP</p>
            <p className="discounted-price">24.990 CLP</p>
          </div>

          <div className="course-card">
            <img src="https://via.placeholder.com/150" alt="Course" className="course-image" />
            <h3>Todo jQuery... de novato a experto</h3>
            <p>Francisco Javier Arce Anguiano</p>
            <p className="price">9.990 CLP</p>
            <p className="discounted-price">31.990 CLP</p>
          </div>

          <div className="course-card">
            <img src="https://via.placeholder.com/150" alt="Course" className="course-image" />
            <h3>Introducción a HTML y CSS</h3>
            <p>Francisco Javier Arce Anguiano</p>
            <p className="price">13.990 CLP</p>
            <p className="discounted-price">37.990 CLP</p>
          </div>

          <div className="course-card">
            <img src="https://via.placeholder.com/150" alt="Course" className="course-image" />
            <h3>Aprende JavaScript, HTML5 y CSS3</h3>
            <p>Francisco Javier Arce Anguiano</p>
            <p className="price">19.990 CLP</p>
            <p className="discounted-price">74.990 CLP</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainPage;
