const BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  token: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  name: string;
}

export interface MockUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface SignupData {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Mock users for demonstration (JSONPlaceholder has 10 users)
const DEMO_CREDENTIALS = [
  { username: 'Bret', password: 'password123' },
  { username: 'Antonette', password: 'password123' },
  { username: 'Samantha', password: 'password123' },
  { username: 'Karianne', password: 'password123' },
  { username: 'Kamren', password: 'password123' },
  { username: 'Leopoldo_Corkery', password: 'password123' },
  { username: 'Elwyn.Skiles', password: 'password123' },
  { username: 'Maxime_Nienow', password: 'password123' },
  { username: 'Delphine', password: 'password123' },
  { username: 'Moriah.Stanton', password: 'password123' },
];

// Validate password requirements
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate username requirements
export const validateUsername = (username: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (username.length > 20) {
    errors.push('Username must be no more than 20 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate a mock JWT token
const generateMockToken = (userId: number): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + (30 * 60 * 1000) // 30 minutes
  }));
  const signature = btoa(`mock-signature-${userId}-${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};

export const signupUser = async (userData: SignupData): Promise<SignupResponse> => {
  try {
    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }
    
    // Validate username
    const usernameValidation = validateUsername(userData.username);
    if (!usernameValidation.isValid) {
      throw new Error(usernameValidation.errors.join('. '));
    }

    // Check if username already exists in demo credentials
    const existingUser = DEMO_CREDENTIALS.find(cred => cred.username === userData.username);
    if (existingUser) {
      throw new Error('Username already exists. Please choose a different username.');
    }

    // Simulate API call to JSONPlaceholder
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username,
        username: userData.username,
        email: userData.email || `${userData.username}@example.com`,
        address: {
          street: '',
          suite: '',
          city: '',
          zipcode: '',
          geo: { lat: '0', lng: '0' }
        },
        phone: '',
        website: '',
        company: {
          name: '',
          catchPhrase: '',
          bs: ''
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create account. Please try again.');
    }

    const data = await response.json();
    
    // Return mock signup response
    return {
      id: data.id || Date.now(),
      username: userData.username,
      email: userData.email || `${userData.username}@example.com`,
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username,
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    // Check demo credentials first
    const demoUser = DEMO_CREDENTIALS.find(cred => 
      cred.username === username && cred.password === password
    );

    if (demoUser) {
      // Fetch user data from JSONPlaceholder
      const userResponse = await fetch(`${BASE_URL}/users?username=${username}`);
      const users = await userResponse.json();
      
      if (users.length > 0) {
        const user = users[0];
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name,
          token: generateMockToken(user.id),
        };
      }
    }

    // If not found in demo credentials, try to find by username only
    const userResponse = await fetch(`${BASE_URL}/users?username=${username}`);
    const users = await userResponse.json();
    
    if (users.length > 0) {
      const user = users[0];
      // For demo purposes, accept any password for existing JSONPlaceholder users
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        token: generateMockToken(user.id),
      };
    }

    throw new Error('Invalid username or password');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async (token: string): Promise<MockUser> => {
  try {
    // Decode mock token to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.userId;
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      throw new Error('Token expired');
    }

    const response = await fetch(`${BASE_URL}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export const refreshAuthToken = async (refreshToken: string): Promise<LoginResponse> => {
  try {
    // For mock API, we'll just generate a new token
    // In a real app, this would validate the refresh token
    const payload = JSON.parse(atob(refreshToken.split('.')[1]));
    const userId = payload.userId;
    
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    const user = await response.json();
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      token: generateMockToken(user.id),
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<{ users: MockUser[] }> => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const users = await response.json();
    return { users };
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

// Get demo credentials for UI display
export const getDemoCredentials = () => DEMO_CREDENTIALS;

// Secure token storage utilities
export const secureStorage = {
  setToken: (token: string) => {
    try {
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Failed to store auth token:', error);
    }
  },
  
  getToken: (): string | null => {
    try {
      return localStorage.getItem('authToken');
    } catch (error) {
      console.error('Failed to retrieve auth token:', error);
      return null;
    }
  },
  
  setRefreshToken: (refreshToken: string) => {
    try {
      localStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  },
  
  getRefreshToken: (): string | null => {
    try {
      return localStorage.getItem('refreshToken');
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  },
  
  clearTokens: () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }
};