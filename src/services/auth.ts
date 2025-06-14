const BASE_URL = 'https://dummyjson.com';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

// Demo credentials for testing
export const getDemoCredentials = () => [
  { username: 'kminchelle', password: '0lelplR' },
  { username: 'atuny0', password: '9uQFF1Lh' },
  { username: 'hbingley1', password: 'CQutx25i8r' }
];

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data));
      
      return {
        success: true,
        user: data,
      };
    } else {
      return {
        success: false,
        error: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Verify token with the API
export const verifyToken = async (): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};