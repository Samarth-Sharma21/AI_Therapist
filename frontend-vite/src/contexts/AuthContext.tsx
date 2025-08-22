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

  useEffect(() => {
    // Check active sessions and sets the user
    const checkUser = async () => {
      try {
        const { user, error } = await authService.getCurrentUser();
        if (error) throw error;
        setUser(user);
        
        // Ensure user profile exists
        if (user) {
          await userService.ensureUserProfileExists(user);
        }
      } catch (error) {
        setError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: authListener } = authService.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Ensure user profile exists when user signs in
        if (session?.user) {
          await userService.ensureUserProfileExists(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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

      const { error } = await authService.signOut();
      if (error) throw error;

      setUser(null);
    } catch (error) {
      setError(error as AuthError);
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
