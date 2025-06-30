import { Navigate } from 'react-router-dom';
import { adminIsAuthenticated } from '../../utils/adminAuth';

export default function UserProtectedRoute({ children }) {
  if (!adminIsAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}