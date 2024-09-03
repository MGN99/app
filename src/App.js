import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    {/* Agrega más rutas aquí */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
