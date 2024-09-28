import React, { useState } from 'react';
import './login.css'; // Asegúrate de tener este archivo CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función simulada para autenticación
  const fakeLoginAPI = async (email, password) => {
    // Simula una llamada a una API con un retardo
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fakeLoginAPI(email, password);
      if (response.success) {
        console.log('Login successful');
        // Guarda el token y redirige
      } else {
        setError('Login failed');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <p>Enter Your Email Address And Password To Access Your Account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Loading...' : 'Login Now'}
          </button>
        </form>
        <div className="signup-link">
          <p>If You Don’t Have An Account Please, <a href="register">Sign Up Now</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
