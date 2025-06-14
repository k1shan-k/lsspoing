import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { 
  loginUser, 
  signupUser,
  getCurrentUser, 
  refreshAuthToken,
  MockUser, 
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

// Convert JSONPlaceholder user to our User format
const convertMockUserToUser = (mockUser: MockUser): User => ({
  id: mockUser.id.toString(),
  name: mockUser.name,
  email: mockUser.email,
  address: mockUser.address ? 
    `${mockUser.address.street} ${mockUser.address.suite}, ${mockUser.address.city} ${mockUser.address.zipcode}`.replace(/^\s*,\s*|\s*,\s*$/, '') :
    'No address provided',
  phoneNumber: mockUser.phone || 'No phone provided',
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
          const mockUser = await getCurrentUser(storedToken);
          const convertedUser = convertMockUserToUser(mockUser);
          setUser(convertedUser);
        } catch (error) {
          // Token is invalid, try to refresh
          const refreshToken = secureStorage.getRefreshToken();
          if (refreshToken) {
            try {
              const refreshResponse = await refreshAuthToken(refreshToken);
              secureStorage.setToken(refreshResponse.token);
              
              const mockUser = await getCurrentUser(refreshResponse.token);
              const convertedUser = convertMockUserToUser(mockUser);
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
      // Use the same token as refresh token for simplicity in mock API
      secureStorage.setRefreshToken(loginResponse.token);
      
      // Get full user data
      const mockUser = await getCurrentUser(loginResponse.token);
      const convertedUser = convertMockUserToUser(mockUser);
      
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
      
      // Return success message asking user to log in
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