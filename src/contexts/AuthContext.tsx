import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { 
  loginUser, 
  signupUser,
  getCurrentUser, 
  refreshAuthToken,
  DummyUser, 
  getAllUsers,
  SignupData,
  secureStorage
} from '../services/auth';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: SignupData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Convert DummyJSON user to our User format
const convertDummyUserToUser = (dummyUser: DummyUser): User => ({
  id: dummyUser.id.toString(),
  name: `${dummyUser.firstName} ${dummyUser.lastName}`.trim() || dummyUser.username,
  email: dummyUser.email,
  address: dummyUser.address ? 
    `${dummyUser.address.address}, ${dummyUser.address.city}, ${dummyUser.address.state} ${dummyUser.address.postalCode}`.replace(/^,\s*|,\s*$/, '') :
    'No address provided',
  phoneNumber: dummyUser.phone || 'No phone provided',
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedToken = secureStorage.getToken();
      
      if (storedToken) {
        try {
          // Verify token is still valid
          const dummyUser = await getCurrentUser(storedToken);
          const convertedUser = convertDummyUserToUser(dummyUser);
          setUser(convertedUser);
        } catch (error) {
          // Token is invalid, try to refresh
          const refreshToken = secureStorage.getRefreshToken();
          if (refreshToken) {
            try {
              const refreshResponse = await refreshAuthToken(refreshToken);
              secureStorage.setToken(refreshResponse.token);
              secureStorage.setRefreshToken(refreshResponse.refreshToken);
              
              const dummyUser = await getCurrentUser(refreshResponse.token);
              const convertedUser = convertDummyUserToUser(dummyUser);
              setUser(convertedUser);
            } catch (refreshError) {
              // Refresh failed, clear all tokens
              secureStorage.clearTokens();
            }
          } else {
            // No refresh token, clear storage
            secureStorage.clearTokens();
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      secureStorage.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      const loginResponse = await loginUser(username, password);
      
      // Store tokens securely
      secureStorage.setToken(loginResponse.token);
      if (loginResponse.refreshToken) {
        secureStorage.setRefreshToken(loginResponse.refreshToken);
      }
      
      // Get full user data
      const dummyUser = await getCurrentUser(loginResponse.token);
      const convertedUser = convertDummyUserToUser(dummyUser);
      
      setUser(convertedUser);
      localStorage.setItem('currentUser', JSON.stringify(convertedUser));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Login failed:', errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      // Create new user
      const signupResponse = await signupUser(userData);
      
      // Return success without attempting auto-login since the dummy API
      // doesn't persist new users for authentication
      return { 
        success: true, 
        message: 'Account created successfully! Please log in with your credentials.' 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      console.error('Signup failed:', errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    secureStorage.clearTokens();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup,
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};