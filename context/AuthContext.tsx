
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../api/supabase';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'ENGINEER' | 'CUSTOMER';

interface UserInfo {
  name: string;
  email: string;
  loginTime: string;
  role: UserRole;
}

interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  loading: boolean;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check for Supabase session
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        const metadata = session.user.user_metadata;
        setUser({
          name: metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          loginTime: new Date().toLocaleTimeString(),
          role: metadata.role || 'CUSTOMER'
        });
      }
      setLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setToken(session.access_token);
        const metadata = session.user.user_metadata;
        setUser({
          name: metadata.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          loginTime: new Date().toLocaleTimeString(),
          role: metadata.role || 'CUSTOMER'
        });
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (newToken: string, userInfo: UserInfo) => {
    setToken(newToken);
    setUser(userInfo);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
