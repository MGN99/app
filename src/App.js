// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/MainPage/login';
import MainPage from './components/MainPage/MainPage';
import RegisterPage from './components/MainPage/RegisterPage';
import UserDashboard from './components/PanelUser/UserDashboard';
import AdminDashboard from './components/PanelAdmin/AdminDashboard';
import ConfirmationPage from './components/ConfirmationPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<UserDashboard />} /> {/* Nueva ruta */}
        <Route path="/adminDashboard" element={<AdminDashboard />} /> {/* Nueva ruta */}
        <Route path="/ConfirmationPage" element={<ConfirmationPage />} /> {/* Nueva ruta */}
      </Routes>
    </Router>
  );
};

export default App;
