// src/components/auth/ProtectedRoute.tsx

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4"></div>
          <div className="text-gray-300">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
