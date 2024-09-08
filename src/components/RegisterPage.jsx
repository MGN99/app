import React, { useState } from 'react';
import axios from 'axios'; // Asegúrate de tener axios
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // Asegúrate de enlazar el archivo CSS

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nameLastName: '',  // Agregamos nameLastName
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Enviar datos al backend con axios
      const response = await axios.post('http://localhost:8080/graphql', {
        query: `
          mutation {
            registerUsuario(
              nameLastName: "${formData.nameLastName}", 
              username: "${formData.username}", 
              email: "${formData.email}", 
              password: "${formData.password}"
            ) {
              id
              username
              email
            }
          }
        `
      });

      const { data } = response;
      if (data.errors) {
        setError(data.errors[0].message);
        setLoading(false);
        return;
      }

      // Si el registro es exitoso, redirigir o mostrar un mensaje de éxito
      console.log('Registro exitoso:', data.data.registerUsuario);
      navigate('/login'); // Redirigir a la página de login

    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear una Cuenta</h2>
        <p>Por favor llena los campos para crear una cuenta nueva.</p>

        <div className="form-group">
          <label htmlFor="nameLastName">Nombre completo</label>
          <input
            type="text"
            id="nameLastName"
            name="nameLastName"
            value={formData.nameLastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
