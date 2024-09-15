import React from 'react';
import './ConfirmationPage.css'; // Importar el CSS personalizado

const ConfirmationPage = () => {
    return (
        <div className="confirmation-container">
            <h1>¡Compra Confirmada!</h1>
            <p>Tu compra ha sido realizada con éxito.</p>
            <div className="order-summary">
                <h2>Resumen de tu pedido</h2>
                {/* Puedes mapear aquí los cursos comprados */}
                <div className="course-item">
                    <div className="course-image-placeholder">150 x 150</div>
                    <div className="course-details">
                        <h3>Nombre del Curso</h3>
                        <p>Profesor: Nombre del Profesor</p>
                        <p>Precio: 9.990 CLP</p>
                    </div>
                </div>
                {/* Repite este bloque para cada curso */}
            </div>
            <button className="back-to-home-button">Volver al Inicio</button>
        </div>
    );
};

export default ConfirmationPage;
