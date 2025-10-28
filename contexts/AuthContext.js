// contexts/AuthContext.js
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on component mount
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const userData = { 
            id: user.id, 
            name: user.name, 
            email: user.email 
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          resolve(userData);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 1000);
    });
  };

  const signup = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
          reject(new Error('User already exists'));
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          password, // In real app, hash this password
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const userData = { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email 
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve(userData);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}