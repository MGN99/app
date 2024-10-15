import React, { useState } from 'react';
import axios from 'axios'; // Asegúrate de tener axios
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/graphql', {
                query: `
                    mutation {
                        loginUsuario(identificador: "${email}", password: "${password}")
                    }
                `
            });

            const { data } = response;
            if (data.errors) {
                setError(data.errors[0].message);
                setLoading(false);
                return;
            }

            // Obtener el mensaje de la respuesta del backend
            const message = data.data.loginUsuario;

            if (message === "Inicio de sesión exitoso") {
                // Aquí podrías almacenar algo en localStorage para mantener el estado de autenticación
                localStorage.setItem('authenticated', 'true');
                localStorage.setItem('email', email); // Guardar el email si es necesario
                navigate('/'); // Redirigir al home después del login exitoso
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

export default Login;