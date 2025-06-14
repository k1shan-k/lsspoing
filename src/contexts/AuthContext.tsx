import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { loginUser, getCurrentUser, DummyUser, getAllUsers } from '../services/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
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
  name: `${dummyUser.firstName} ${dummyUser.lastName}`,
  email: dummyUser.email,
  address: `${dummyUser.address.address}, ${dummyUser.address.city}, ${dummyUser.address.state} ${dummyUser.address.postalCode}`,
  phoneNumber: dummyUser.phone,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailToUsernameMap, setEmailToUsernameMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load email to username mapping from DummyJSON users and check stored auth
    const initializeAuth = async () => {
      try {
        // First, load the user mapping
        const { users } = await getAllUsers();
        const mapping: Record<string, string> = {};
        users.forEach(user => {
          mapping[user.email] = user.username;
        });
        setEmailToUsernameMap(mapping);

        // Then check for stored token
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
          try {
            // Verify token is still valid with DummyJSON
            const dummyUser = await getCurrentUser(storedToken);
            const convertedUser = convertDummyUserToUser(dummyUser);
            setUser(convertedUser);
          } catch (error) {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Convert email to username if we have the mapping
      const username = emailToUsernameMap[email] || email;
      
      const loginResponse = await loginUser(username, password);
      
      // Get full user data
      const dummyUser = await getCurrentUser(loginResponse.token);
      const convertedUser = convertDummyUserToUser(dummyUser);
      
      setUser(convertedUser);
      localStorage.setItem('authToken', loginResponse.token);
      localStorage.setItem('currentUser', JSON.stringify(convertedUser));
      
      return true;
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};