import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './UserDashboard.css';
import CourseCard from './CourseCard';
import UserProfile from './UserProfile';
import UserSettings from './UserSettings';

const UserDashboard = () => {
  const [currentSection, setCurrentSection] = useState('courses'); // Sección predeterminada
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const coursesPerPage = 6; // Número de cursos por página

  // Lista de cursos
  const courses = [
    { title: 'Introduction to React', instructor: 'Jane Smith', progress: 60 },
    { title: 'Advanced JavaScript', instructor: 'John Doe', progress: 40 },
    { title: 'Python for Beginners', instructor: 'Alice Johnson', progress: 80 },
    { title: 'Data Science', instructor: 'Bob Lee', progress: 90 },
    { title: 'Machine Learning', instructor: 'Tom Harris', progress: 30 },
    { title: 'HTML & CSS Basics', instructor: 'Eve Clark', progress: 100 },
    { title: 'Web Development', instructor: 'Chris Evans', progress: 50 },
    { title: 'Database Management', instructor: 'Emma Watson', progress: 70 },
  ];

  // Calcular el número total de páginas
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Obtener los cursos que se muestran en la página actual
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Funciones para cambiar de página
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const renderSectionContent = () => {
    switch (currentSection) {
      case 'courses':
        return (
          <div className="courses-list">
            <h1>Welcome to My Courses</h1>
            <div className="course-cards">
              {currentCourses.map((course, index) => (
                <CourseCard
                  key={index}
                  title={course.title}
                  instructor={course.instructor}
                  progress={course.progress}
                />
              ))}
            </div>
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages}>Siguiente</button>
            </div>
          </div>
        );
      case 'profile':
        return <UserProfile />;  // Usar el componente de Profile
      case 'settings':
        return <UserSettings />;  // Usar el componente de Settings
      default:
        return <h1>My Courses</h1>;
    }
  };

  return (
    <div className="user-dashboard">
      <Sidebar onSectionChange={setCurrentSection} />
      <div className="content">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default UserDashboard;
