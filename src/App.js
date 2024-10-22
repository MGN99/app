import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/MainPage/login';
import MainPage from './components/MainPage/MainPage';
import RegisterPage from './components/MainPage/RegisterPage';
import UserDashboard from './components/PanelUser/UserDashboard';
import AdminDashboard from './components/PanelAdmin/AdminDashboard';
import ConfirmationPage from './components/ConfirmationPage';
import CartPage from './components/MainPage/CartPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cart" element={<CartPage />} /> {/* Componente del carrito como ruta independiente */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/ConfirmationPage" element={<ConfirmationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
