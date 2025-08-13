import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  role: 'admin' | 'user';
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedAuth === 'true' && storedEmail) {
      fetch(`http://localhost:5000/api/auth/user-info?email=${storedEmail}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.email && data.name && data.role) {
            setIsAuthenticated(true);
            setUserEmail(storedEmail);
            setUser({
              email: data.email,
              name: data.name,
              role: data.role
            });
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!data.success) return false;

      const { name, role } = data.user;
      const userData: User = { email, name, role };

      setIsAuthenticated(true);
      setUserEmail(email);
      setUser(userData);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserEmail(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!user || !token) return false;

    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, userEmail, login, logout, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};
