import { User } from '../types';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

const STORAGE_KEYS = {
  USER: 'pothole-app-user',
  USERS_DB: 'pothole-app-users',
};

// Mock users database stored in localStorage
const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS_DB);
  return stored ? JSON.parse(stored) : [];
};

const saveUsers = (users: User[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  return stored ? JSON.parse(stored) : null;
};

const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// Initialize with some demo users if none exist
const initializeDemoUsers = (): void => {
  const existingUsers = getStoredUsers();
  if (existingUsers.length === 0) {
    const demoUsers: User[] = [
      {
        uid: 'demo-citizen-1',
        email: 'citizen@demo.com',
        role: 'citizen',
        name: 'Demo Citizen',
        score: 120,
        reports: 8,
      },
      {
        uid: 'demo-employee-1',
        email: 'employee@demo.com',
        role: 'employee',
        name: 'Demo Employee',
      },
    ];
    saveUsers(demoUsers);
  }
};

export const authService = {
  // Initialize demo users
  init: (): void => {
    initializeDemoUsers();
  },

  // Get current authentication state
  getAuthState: (): AuthState => {
    const user = getCurrentUser();
    return {
      isAuthenticated: !!user,
      user,
      isLoading: false,
    };
  },

  // Sign up new user
  signUp: async (email: string, _password: string, name: string, role: 'citizen' | 'employee'): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const users = getStoredUsers();
      
      // Check if user already exists
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Create new user
      const newUser: User = {
        uid: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email,
        role,
        name,
        score: role === 'citizen' ? 0 : undefined,
        reports: role === 'citizen' ? 0 : undefined,
      };

      // Save to users database
      users.push(newUser);
      saveUsers(users);

      // Set as current user
      saveCurrentUser(newUser);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Failed to create account' };
    }
  },

  // Sign in existing user
  signIn: async (email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const users = getStoredUsers();
      const user = users.find(u => u.email === email);

      if (!user) {
        return { success: false, error: 'No account found with this email' };
      }

      // In a real app, you'd verify the password here
      // For this demo, we'll just accept any password
      saveCurrentUser(user);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Failed to sign in' };
    }
  },

  // Sign out current user
  signOut: (): void => {
    saveCurrentUser(null);
  },

  // Update current user (e.g., score, reports count)
  updateUser: (updates: Partial<User>): User | null => {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    
    // Update in users database
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.uid === currentUser.uid);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      saveUsers(users);
    }

    // Update current user
    saveCurrentUser(updatedUser);
    
    return updatedUser;
  },

  // Get all citizens for leaderboard
  getCitizens: (): User[] => {
    return getStoredUsers().filter(u => u.role === 'citizen');
  },
};
