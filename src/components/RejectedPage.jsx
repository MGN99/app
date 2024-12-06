import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const RejectedPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
  
    const user = queryParams.get('user');
    const courses = queryParams.get('courses');
    const amount = queryParams.get('amount');
  
    return (
      <RejectedContainer>
        <Title>Pago Rechazado</Title>
        <Paragraph>Lo sentimos, tu pago no pudo ser procesado.</Paragraph>
        <OrderSummary>
          <h2>Resumen de tu pedido</h2>
          <OrderItem><strong>Usuario:</strong> {user}</OrderItem>
          <OrderItem><strong>Cursos:</strong> {courses}</OrderItem>
          <OrderItem><strong>Total:</strong> ${amount} CLP</OrderItem>
        </OrderSummary>
        <BackButton onClick={() => window.location.href = '/'}>
          Volver al Inicio
        </BackButton>
      </RejectedContainer>
    );
  };
  
  export default RejectedPage;


// Definir los estilos con styled-components
const RejectedContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background: linear-gradient(145deg, #ff6b6b, #ff4c4c); /* Gradiente en tonos cálidos */
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: #fff;
  margin-bottom: 20px;
  font-weight: 600;
`;

const Paragraph = styled.p`
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 40px;
`;

const OrderSummary = styled.div`
  margin-top: 20px;
  text-align: left;
  background-color: rgba(255, 255, 255, 0.9); /* Fondo blanco translúcido */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const OrderItem = styled.p`
  font-size: 1.2rem;
  color: #333;
  margin: 8px 0;
`;

const BackButton = styled.button`
  padding: 12px 30px;
  font-size: 1.1rem;
  color: #fff;
  background-color: #28a745; /* Verde */
  border: none;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 30px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #218838; /* Verde oscuro */
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(2px);
  }
`;