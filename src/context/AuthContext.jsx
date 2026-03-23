import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('djob_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('djob_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('djob_user');
    }
  }, [user]);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('djob_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('djob_users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: 'user-' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('djob_users', JSON.stringify(users));
    const { password: _, ...safe } = newUser;
    setUser(safe);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
