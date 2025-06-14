const BASE_URL = 'https://dummyjson.com';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  refreshToken: string;
}

export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface DummyUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  phone: string;
  address: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    postalCode: string;
    state: string;
  };
}

export interface SignupData {
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Validate password requirements
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
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
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
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

    const response = await fetch(`${BASE_URL}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || `${userData.username}@example.com`,
        phone: '',
        image: 'https://robohash.org/' + userData.username,
        address: {
          address: '',
          city: '',
          coordinates: { lat: 0, lng: 0 },
          postalCode: '',
          state: ''
        }
      })
    });

    if (!response.ok) {
      let errorMessage = `Signup failed (${response.status} ${response.statusText})`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (response.status === 400) {
          errorMessage = 'Username already exists or invalid data provided';
        }
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30, // Token expires in 30 minutes
      })
    });

    if (!response.ok) {
      let errorMessage = `Login failed (${response.status} ${response.statusText})`;
      
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (response.status === 400) {
          errorMessage = 'Invalid username or password';
        }
      } catch {
        // If we can't parse the error response, use the default message
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async (token: string): Promise<DummyUser> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data - token may be expired');
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
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken,
        expiresInMins: 30,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<{ users: DummyUser[] }> => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

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