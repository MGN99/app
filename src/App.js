import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import MainPage from './components/MainPage';
import RegisterPage from './components/RegisterPage';

const App = () => {
    return (
        <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} /> 
        </Routes>
      </Router>
    );
};

export default App;
