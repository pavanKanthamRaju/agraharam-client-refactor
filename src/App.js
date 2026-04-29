
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import AuthLayout from './layouts/AuthLayout';
import DashboardPage from './pages/Dashboardpage';
import MainLayout from './layouts/MainLayout';
import SignUpPage from './features/auth/pages/SignUpPage';
import ProtectedRoute from './routes/ProtectedRoute';
import PoojaDetailsPage from './pages/PoojaDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderReview from './pages/OrderReview';
import OrdersPage from './pages/OrdersPage';
import AdminRoute from './routes/AdminRoute';
import AdminMainLayout from './layouts/AdminMainLayout';
import { GoogleOAuthProvider } from '@react-oauth/google';
function App() {
  return (
    <GoogleOAuthProvider clientId="624201486661-caq1et7an3otskdrq5ua7dbh4rk9qsdi.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUpPage /></AuthLayout>} />
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/pooja/:id" element={<MainLayout> <PoojaDetailsPage /></MainLayout>} />
          <Route path="/checkout/:id" element={<ProtectedRoute ><MainLayout> <CheckoutPage /></MainLayout></ProtectedRoute>} />
          <Route path="/order-review" element={<ProtectedRoute><MainLayout><OrderReview /></MainLayout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MainLayout><OrdersPage /></MainLayout></ProtectedRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminMainLayout /></AdminRoute>} />


        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
