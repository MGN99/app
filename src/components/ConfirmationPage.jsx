// ConfirmationPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const user = queryParams.get('user');
    const courses = queryParams.get('courses');
    const amount = queryParams.get('amount');

    return (
        <div className="confirmation-container">
            <h1>¡Compra Confirmada!</h1>
            <p>Tu compra ha sido realizada con éxito.</p>
            <div className="order-summary">
                <h2>Resumen de tu pedido</h2>
                <p>Usuario: {user}</p>
                <p>Cursos: {courses}</p>
                <p>Total: ${amount} CLP</p>
            </div>
            <button
                className="back-to-home-button"
                onClick={() => window.location.href = '/'}
            >
                Volver al Inicio
            </button>
        </div>
    );
};

export default ConfirmationPage;
