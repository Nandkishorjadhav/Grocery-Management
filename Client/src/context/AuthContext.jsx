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
          console.log('👤 Profile fetched:', response);
          if (response && response.success) {
            console.log('👤 Setting user from profile:', response.user);
            console.log('👤 Admin check - isAdmin:', response.user?.isAdmin, 'role:', response.user?.role);
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
    console.log('🔐 AuthContext.login called with userData:', userData);
    console.log('🔐 Admin status - isAdmin:', userData?.isAdmin, 'role:', userData?.role);
    authService.setAuthToken(token);
    authService.storeUser(userData);
    setUser(userData);
    console.log('✅ User state updated in AuthContext');
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

  const updateUser = (userData) => {
    setUser(userData);
    authService.storeUser(userData);
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
    updateUser,
    openAuthModal,
    closeAuthModal,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
