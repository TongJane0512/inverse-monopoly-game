import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/index';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    window.location.href = '/login';
    return null;
  }

  if (adminOnly && user.role !== 'admin' && user.role !== 'staff') {
    window.location.href = '/';
    return null;
  }

  return children;
};

export default ProtectedRoute;
