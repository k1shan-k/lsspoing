const STORAGE_KEY = 'mockUsers';
const AUTH_TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  username: string;
  password: string;
  address?: string;
  phoneNumber?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address?: string;
  phoneNumber?: string;
  image: string;
  token: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Initialize with some demo users
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem(STORAGE_KEY);
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 1,
        username: 'demo_user',
        email: 'demo@example.com',
        firstName: 'Demo',
        lastName: 'User',
        address: '123 Demo Street, Demo City',
        phoneNumber: '+1-555-0123',
        password: 'demo123',
        image: 'https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        address: '456 Main Street, Anytown',
        phoneNumber: '+1-555-0456',
        password: 'john123',
        image: 'https://ui-avatars.com/api/?name=John+Doe&background=f093fb&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'jane_smith',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        address: '789 Oak Avenue, Springfield',
        phoneNumber: '+1-555-0789',
        password: 'jane123',
        image: 'https://ui-avatars.com/api/?name=Jane+Smith&background=11998e&color=fff',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  }
};

// Get all users from localStorage
const getStoredUsers = () => {
  initializeDemoUsers();
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Generate a simple token
const generateToken = (userId: number) => {
  return btoa(`user_${userId}_${Date.now()}`);
};

// Demo credentials for testing
export const getDemoCredentials = () => [
  { username: 'demo_user', password: 'demo123' },
  { username: 'john_doe', password: 'john123' },
  { username: 'jane_smith', password: 'jane123' }
];

// Simulate API delay
const simulateDelay = (ms: number = 800) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    await simulateDelay();
    
    const users = getStoredUsers();
    const user = users.find((u: any) => 
      u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const token = generateToken(user.id);
      const userWithToken = {
        ...user,
        token,
        password: undefined // Don't include password in response
      };

      // Store token and user data
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithToken));
      
      return {
        success: true,
        user: userWithToken,
      };
    } else {
      return {
        success: false,
        error: 'Invalid username or password',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please check your connection and try again.',
    };
  }
};

export const signup = async (signupData: SignupData): Promise<AuthResponse> => {
  try {
    await simulateDelay();
    
    const users = getStoredUsers();
    
    // Check if username or email already exists
    const existingUser = users.find((u: any) => 
      u.username === signupData.username || u.email === signupData.email
    );

    if (existingUser) {
      return {
        success: false,
        error: existingUser.username === signupData.username 
          ? 'Username already exists' 
          : 'Email already exists',
      };
    }

    // Create new user
    const [firstName, ...lastNameParts] = signupData.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const newUser = {
      id: users.length + 1,
      username: signupData.username,
      email: signupData.email,
      firstName,
      lastName,
      address: signupData.address || '',
      phoneNumber: signupData.phoneNumber || '',
      password: signupData.password,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(signupData.name)}&background=667eea&color=fff`,
      createdAt: new Date().toISOString()
    };

    // Add to users array and save
    users.push(newUser);
    saveUsers(users);

    // Auto-login the new user
    const token = generateToken(newUser.id);
    const userWithToken = {
      ...newUser,
      token,
      password: undefined // Don't include password in response
    };

    // Store token and user data
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithToken));

    return {
      success: true,
      user: userWithToken,
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Verify token (mock implementation)
export const verifyToken = async (): Promise<boolean> => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  if (!token || !user) return false;

  try {
    // Simulate API call delay
    await simulateDelay(300);
    
    // Simple token validation - check if it matches expected format
    const expectedToken = generateToken(user.id);
    return token.startsWith('user_') && token.length > 10;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

// Get all registered users (for admin purposes - remove in production)
export const getAllUsers = () => {
  return getStoredUsers().map((user: any) => ({
    ...user,
    password: undefined // Don't expose passwords
  }));
};

// Reset to demo users (for testing)
export const resetToDemo = () => {
  localStorage.removeItem(STORAGE_KEY);
  initializeDemoUsers();
};