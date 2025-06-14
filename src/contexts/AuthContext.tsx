import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, SignupData } from '../types';
import { loginUser, getCurrentUser, DummyUser, getAllUsers } from '../services/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
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
    // Load email to username mapping from DummyJSON users
    const loadUserMapping = async () => {
      try {
        const { users } = await getAllUsers();
        const mapping: Record<string, string> = {};
        users.forEach(user => {
          mapping[user.email] = user.username;
        });
        setEmailToUsernameMap(mapping);
      } catch (error) {
        console.error('Failed to load user mapping:', error);
      }
    };

    loadUserMapping();

    // Check for stored token on component mount
    const checkStoredAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedToken && storedUser) {
        try {
          // For local users (signup), just restore from localStorage
          if (storedToken.startsWith('local-')) {
            setUser(JSON.parse(storedUser));
          } else {
            // For DummyJSON users, verify token is still valid
            const dummyUser = await getCurrentUser(storedToken);
            const convertedUser = convertDummyUserToUser(dummyUser);
            setUser(convertedUser);
          }
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // First try DummyJSON login
      try {
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
      } catch (dummyError) {
        // If DummyJSON login fails, try local users (for signup users)
        const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
        const localUser = localUsers.find((u: any) => 
          u.email === email && u.password === password
        );
        
        if (localUser) {
          const { password: _, ...userWithoutPassword } = localUser;
          setUser(userWithoutPassword);
          localStorage.setItem('authToken', 'local-' + userWithoutPassword.id);
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          return true;
        }
        
        // If both fail, throw the original error
        throw dummyError;
      }
    } catch (error) {
      console.error('Login failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    try {
      // Since DummyJSON doesn't have a real signup endpoint, 
      // we'll simulate it by storing in localStorage and auto-login
      const users = JSON.parse(localStorage.getItem('localUsers') || '[]');
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
      };

      // Store in local storage for future reference
      users.push({ ...newUser, password: userData.password });
      localStorage.setItem('localUsers', JSON.stringify(users));

      // Auto-login after signup
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('authToken', 'local-' + newUser.id);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
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
      signup, 
      logout, 
      isAuthenticated, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};