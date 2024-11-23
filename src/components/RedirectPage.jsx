// RedirectPage.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RedirectPage = ({ isRejected }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const user = queryParams.get('user');
    const courses = queryParams.get('courses');
    const amount = queryParams.get('amount');

    // Construye la URL final dependiendo del estado del pago
    const targetUrl = isRejected
      ? `/RejectedPage?user=${encodeURIComponent(user)}&courses=${encodeURIComponent(courses)}&amount=${encodeURIComponent(amount)}`
      : `/ConfirmationPage?user=${encodeURIComponent(user)}&courses=${encodeURIComponent(courses)}&amount=${encodeURIComponent(amount)}`;

    // Redirige a la página correspondiente
    navigate(targetUrl);
  }, [location, navigate, isRejected]);

  return <p>Redirigiendo...</p>;
};

export default RedirectPage;
