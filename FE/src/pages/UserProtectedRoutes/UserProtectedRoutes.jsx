import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import { adminIsAuthenticated } from '../../utils/adminAuth';

export default function UserProtectedRoute({ children }) {
  if(adminIsAuthenticated()){
    return <Navigate to="/admin/home" replace />;
  }
  else if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}