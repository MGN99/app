import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // Hook para redirigir

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Simulación del backend
        setTimeout(() => {
            if (email === 'test@example.com' && password === 'password123') {
                console.log('Login successful');
                localStorage.setItem('token', 'mockToken123');
                localStorage.setItem('email', email); // Guardamos el email en localStorage
                navigate('/'); // Redirigimos al home
            } else {
                setError('Invalid email or password');
            }
            setLoading(false);
        }, 1000);
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
