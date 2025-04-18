import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer component
 * 
 * This component ensures that authentication state is fully initialized
 * before rendering children components. This prevents flashing of login
 * screens when a user is actually authenticated.
 */
const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const { isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If auth is no longer loading, we're ready to render
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-lg text-gray-700">Initializing authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthInitializer;
