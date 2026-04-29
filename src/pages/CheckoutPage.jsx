import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const poojaId = location.state?.poojaId;
debugger
  useEffect(() => {
    const handlePopState = (event) => {
      // Redirect to specific page when user presses browser back
      if (poojaId) {
        navigate(`/pooja/${poojaId}`, { replace: true });
      } else {
        navigate('/', { replace: true }); // fallback
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, poojaId]);

  return (
    <div className="p-4">
      <h2>Checkout Page</h2>
      {/* your content */}
    </div>
  );
};

export default CheckoutPage;
