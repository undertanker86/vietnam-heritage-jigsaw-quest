import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
  hasAdvantage: boolean;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  upgradeToAdvantage: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = localStorage.getItem('vietnam-puzzle-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Always give users Advantage access
      setUser({ ...userData, hasAdvantage: true });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in real app, this would call your backend
    if (email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        hasAdvantage: true // Always give Advantage access
      };
      setUser(newUser);
      localStorage.setItem('vietnam-puzzle-user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Simulate registration
    if (email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        hasAdvantage: true // Always give Advantage access
      };
      setUser(newUser);
      localStorage.setItem('vietnam-puzzle-user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vietnam-puzzle-user');
  };

  const upgradeToAdvantage = async (): Promise<boolean> => {
    // No longer needed, but keep for compatibility
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        upgradeToAdvantage
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
