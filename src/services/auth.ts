const BASE_URL = 'https://jsonplaceholder.typicode.com';
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

// Initialize with demo users from JSONPlaceholder-like data
const initializeDemoUsers = () => {
  const existingUsers = localStorage.getItem(STORAGE_KEY);
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 1,
        username: 'bret',
        email: 'sincere@april.biz',
        firstName: 'Leanne',
        lastName: 'Graham',
        address: 'Kulas Light Apt. 556, Gwenborough',
        phoneNumber: '1-770-736-8031',
        password: 'demo123',
        image: 'https://ui-avatars.com/api/?name=Leanne+Graham&background=667eea&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'antonette',
        email: 'shanna@melissa.tv',
        firstName: 'Ervin',
        lastName: 'Howell',
        address: 'Victor Plains Suite 879, Wisokyburgh',
        phoneNumber: '010-692-6593',
        password: 'user123',
        image: 'https://ui-avatars.com/api/?name=Ervin+Howell&background=f093fb&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'samantha',
        email: 'nathan@yesenia.net',
        firstName: 'Clementine',
        lastName: 'Bauch',
        address: 'Douglas Extension Suite 847, McKenziehaven',
        phoneNumber: '1-463-123-4447',
        password: 'pass123',
        image: 'https://ui-avatars.com/api/?name=Clementine+Bauch&background=11998e&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        username: 'karianne',
        email: 'julianne.oconner@kory.org',
        firstName: 'Patricia',
        lastName: 'Lebsack',
        address: 'Hoeger Mall Apt. 692, South Elvis',
        phoneNumber: '493-170-9623',
        password: 'test123',
        image: 'https://ui-avatars.com/api/?name=Patricia+Lebsack&background=f7971e&color=fff',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        username: 'kamren',
        email: 'lucio_hettinger@annie.ca',
        firstName: 'Chelsey',
        lastName: 'Dietrich',
        address: 'Skiles Walks Suite 351, Roscoeview',
        phoneNumber: '(254)954-1289',
        password: 'admin123',
        image: 'https://ui-avatars.com/api/?name=Chelsey+Dietrich&background=ff416c&color=fff',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  }
};

// Fetch users from JSONPlaceholder API
const fetchUsersFromAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error('API request failed');
    
    const apiUsers = await response.json();
    
    // Transform API users to our format
    const transformedUsers = apiUsers.slice(0, 5).map((user: any, index: number) => ({
      id: user.id,
      username: user.username.toLowerCase(),
      email: user.email,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      address: `${user.address.street} ${user.address.suite}, ${user.address.city}`,
      phoneNumber: user.phone,
      password: ['demo123', 'user123', 'pass123', 'test123', 'admin123'][index],
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=${['667eea', 'f093fb', '11998e', 'f7971e', 'ff416c'][index]}&color=fff`,
      createdAt: new Date().toISOString()
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(transformedUsers));
    return transformedUsers;
  } catch (error) {
    console.warn('Failed to fetch from API, using local demo data:', error);
    initializeDemoUsers();
    return getStoredUsers();
  }
};

// Get all users from localStorage
const getStoredUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Generate a realistic JWT-like token
const generateToken = (userId: number) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }));
  const signature = btoa(`signature_${userId}_${Date.now()}`);
  return `${header}.${payload}.${signature}`;
};

// Demo credentials for testing
export const getDemoCredentials = () => [
  { username: 'bret', password: 'demo123' },
  { username: 'antonette', password: 'user123' },
  { username: 'samantha', password: 'pass123' },
  { username: 'karianne', password: 'test123' },
  { username: 'kamren', password: 'admin123' }
];

// Simulate realistic API delay
const simulateDelay = (ms: number = 1200) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Initialize users on first load
let usersInitialized = false;
const ensureUsersInitialized = async () => {
  if (!usersInitialized) {
    await fetchUsersFromAPI();
    usersInitialized = true;
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    await ensureUsersInitialized();
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
        error: 'Invalid username or password. Please check your credentials.',
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
    await ensureUsersInitialized();
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
          ? 'Username already exists. Please choose a different username.' 
          : 'Email already exists. Please use a different email address.',
      };
    }

    // Simulate API call to create user
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify({
          name: signupData.name,
          username: signupData.username,
          email: signupData.email,
          address: {
            street: signupData.address || '',
            city: 'Demo City'
          },
          phone: signupData.phoneNumber || ''
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('User created via API:', apiResponse);
      }
    } catch (apiError) {
      console.warn('API creation failed, proceeding with local storage:', apiError);
    }

    // Create new user locally
    const [firstName, ...lastNameParts] = signupData.name.trim().split(' ');
    const lastName = lastNameParts.join(' ') || '';
    
    const newUser = {
      id: Math.max(...users.map((u: any) => u.id), 0) + 1,
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
      error: 'Registration failed. Please try again.',
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

// Verify token with realistic validation
export const verifyToken = async (): Promise<boolean> => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  if (!token || !user) return false;

  try {
    // Simulate API call delay
    await simulateDelay(500);
    
    // Parse JWT-like token
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        return false;
      }
      
      // Check if user ID matches
      return payload.sub === user.id;
    } catch (parseError) {
      return false;
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

// Get user profile (simulate API call)
export const getUserProfile = async (userId: number) => {
  try {
    await simulateDelay(800);
    
    // Try to fetch from API first
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`);
      if (response.ok) {
        const apiUser = await response.json();
        return {
          ...apiUser,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name)}&background=667eea&color=fff`
        };
      }
    } catch (apiError) {
      console.warn('API fetch failed, using local data');
    }
    
    // Fallback to local storage
    const users = getStoredUsers();
    return users.find((u: any) => u.id === userId);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId: number, updates: Partial<User>) => {
  try {
    await simulateDelay(1000);
    
    // Simulate API call
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      
      if (response.ok) {
        console.log('Profile updated via API');
      }
    } catch (apiError) {
      console.warn('API update failed, updating locally');
    }
    
    // Update local storage
    const users = getStoredUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveUsers(users);
      
      // Update current user if it's the same user
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
      
      return { success: true };
    }
    
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Update failed' };
  }
};

// Get all registered users (for admin purposes)
export const getAllUsers = () => {
  return getStoredUsers().map((user: any) => ({
    ...user,
    password: undefined // Don't expose passwords
  }));
};

// Reset to demo users (for testing)
export const resetToDemo = async () => {
  localStorage.removeItem(STORAGE_KEY);
  usersInitialized = false;
  await fetchUsersFromAPI();
};

// Initialize users when module loads
fetchUsersFromAPI();