import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser) {
        setUser(storedUser);

        // Verify token is still valid
        try {
          const response = await authService.getProfile();
          if (response && response.success) {
            setUser(response.user);
            authService.storeUser(response.user);
          } else {
            // Invalid response
            console.log('Invalid profile response, clearing auth');
            authService.clearAuth();
            setUser(null);
          }
        } catch (error) {
          // Token expired or invalid - clear everything
          console.log('Token invalid or expired, clearing auth');
          authService.clearAuth();
          setUser(null);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    authService.setAuthToken(token);
    authService.storeUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearAuth();
      setUser(null);
    }
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    showAuthModal,
    login,
    logout,
    openAuthModal,
    closeAuthModal,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
