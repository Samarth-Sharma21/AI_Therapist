import { createClient, User } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
  code?: string;
}

export const authService = {
  async signUp(
    email: string,
    password: string,
    username?: string,
    fullName?: string
  ) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/chat`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: Error | unknown) {
      return { data: null, error: error as AuthError };
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error: Error | unknown) {
      return { data: null, error: error as AuthError };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error: Error | unknown) {
      return { error: error as AuthError };
    }
  },

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error: Error | unknown) {
      return { error: error as AuthError };
    }
  },

  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error: Error | unknown) {
      return { error: error as AuthError };
    }
  },

  async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error: Error | unknown) {
      return { user: null, error: error as AuthError };
    }
  },

  onAuthStateChange(
    callback: (event: string, session: { user: User | null } | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export const userService = {
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: Error | unknown) {
      return { data: null, error: error as AuthError };
    }
  },

  async createUserProfile(
    userId: string,
    email: string,
    username?: string,
    fullName?: string
  ) {
    try {
      const { data, error } = await supabase.from("user_profiles").insert([
        {
          id: userId,
          email,
          username,
          full_name: fullName,
        },
      ]);

      if (error) throw error;
      return { data, error: null };
    } catch (error: Error | unknown) {
      return { data: null, error: error as AuthError };
    }
  },

  async ensureUserProfileExists(user: User) {
    try {
      const { data: existingProfile } = await this.getUserProfile(user.id);
      
      if (!existingProfile) {
        const { data, error } = await this.createUserProfile(
          user.id,
          user.email!,
          user.user_metadata?.username,
          user.user_metadata?.full_name
        );
        
        if (error) throw error;
        return { data, error: null };
      }
      
      return { data: existingProfile, error: null };
    } catch (error: Error | unknown) {
      return { data: null, error: error as AuthError };
    }
  },
};
