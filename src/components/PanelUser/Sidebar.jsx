import React, { useState } from 'react';
import { Book, User, Settings, LogOut } from 'lucide-react';
import './UserDashboard.css';

const Sidebar = ({ onSectionChange }) => {
  const [activeSection, setActiveSection] = useState('courses'); // 'courses' será la sección por defecto

  const handleSectionChange = (section) => {
    setActiveSection(section);
    onSectionChange(section); // Notifica al UserDashboard que la sección ha cambiado
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>ένας</h2>
      </div>
      <ul className="sidebar-menu">
        <li 
          className={activeSection === 'courses' ? 'active' : ''} 
          onClick={() => handleSectionChange('courses')}
        >
          <Book className="icon" /> My Courses
        </li>
        <li 
          className={activeSection === 'profile' ? 'active' : ''} 
          onClick={() => handleSectionChange('profile')}
        >
          <User className="icon" /> Profile
        </li>
        <li 
          className={activeSection === 'settings' ? 'active' : ''} 
          onClick={() => handleSectionChange('settings')}
        >
          <Settings className="icon" /> Settings
        </li>
      </ul>
      <div className="logout">
        <LogOut className="icon" /> Logout
      </div>
    </div>
  );
};

export default Sidebar;
