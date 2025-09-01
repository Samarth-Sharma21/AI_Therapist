import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { authService, userService, AuthError } from "../services/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (
    email: string,
    password: string,
    username?: string,
    fullName?: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        
        if (!isMounted) return;
        
        if (error) {
          console.warn('Auth initialization error:', error);
          setUser(null);
        } else {
          setUser(user);
          
          // Ensure user profile exists if user is authenticated
          if (user) {
            try {
              await userService.ensureUserProfileExists(user);
            } catch (profileError) {
              console.warn('Profile creation error:', profileError);
              // Don't fail auth if profile creation fails
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (isMounted) {
          setUser(null);
          setError(error as AuthError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
        try {
          setUser(session?.user ?? null);
          
          // Ensure user profile exists when user signs in
          if (session?.user && event === 'SIGNED_IN') {
            try {
              await userService.ensureUserProfileExists(session.user);
            } catch (profileError) {
              console.warn('Profile creation error on sign in:', profileError);
            }
          }
          
          // Clear session data on sign out
          if (event === 'SIGNED_OUT') {
            setUser(null);
            // Clear all session-related storage
            sessionStorage.clear();
            localStorage.removeItem('last_active_session');
            localStorage.removeItem('cached_chat_sessions');
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setError(error as AuthError);
        } finally {
          if (initialized) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [initialized]);

  const signUp = async (
    email: string,
    password: string,
    username?: string,
    fullName?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await authService.signUp(
        email,
        password,
        username,
        fullName
      );
      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        // User profile will be created automatically via database trigger
      }
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await authService.signIn(email, password);
      if (error) throw error;

      setUser(data.user);
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear all local data first
      sessionStorage.clear();
      localStorage.removeItem('last_active_session');
      localStorage.removeItem('cached_chat_sessions');

      const { error } = await authService.signOut();
      if (error) throw error;

      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error as AuthError);
      // Even if sign out fails, clear local state
      setUser(null);
      sessionStorage.clear();
      localStorage.removeItem('last_active_session');
      localStorage.removeItem('cached_chat_sessions');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await authService.resetPassword(email);
      if (error) throw error;
    } catch (error) {
      setError(error as AuthError);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};