// RedirectPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedirectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get('user');
    const courses = queryParams.get('courses');
    const amount = queryParams.get('amount');

    // Construye la URL final para la página de confirmación
    const confirmationUrl = `/ConfirmationPage?user=${encodeURIComponent(
      user
    )}&courses=${encodeURIComponent(courses)}&amount=${encodeURIComponent(amount)}`;

    // Redirige a la página de confirmación
    navigate(confirmationUrl);
  }, [location, navigate]);

  return <p>Redirigiendo...</p>;
};

export default RedirectPage;
