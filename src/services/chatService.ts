import { supabase } from './supabase';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
}

export interface CreateSessionData {
  title?: string;
}

export interface UpdateSessionData {
  title?: string;
}

export const chatService = {
  // Session Management
  async createSession(data: CreateSessionData = {}): Promise<{ data: ChatSession | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: user.id,
            title: data.title || 'New Chat Session',
          },
        ])
        .select()
        .single();

      return { data: session, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getSessions(): Promise<{ data: ChatSession[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getSession(sessionId: string): Promise<{ data: ChatSession | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async updateSession(sessionId: string, updates: UpdateSessionData): Promise<{ data: ChatSession | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteSession(sessionId: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }

      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', user.id);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Message Management
  async getMessages(sessionId: string): Promise<{ data: ChatMessage[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async addMessage(sessionId: string, content: string, isUserMessage: boolean = true): Promise<{ data: ChatMessage | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            session_id: sessionId,
            user_id: user.id,
            content,
            is_user_message: isUserMessage,
          },
        ])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteMessage(messageId: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { error: { message: 'User not authenticated' } };
      }

      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId)
        .eq('user_id', user.id);

      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Utility Functions
  async generateSessionTitle(firstMessage: string): Promise<string> {
    if (firstMessage.length > 50) {
      return firstMessage.substring(0, 47) + '...';
    }
    return firstMessage;
  },

  async updateSessionTitleFromFirstMessage(sessionId: string, firstMessage: string): Promise<{ error: any }> {
    try {
      const title = await this.generateSessionTitle(firstMessage);
      const { error } = await this.updateSession(sessionId, { title });
      return { error };
    } catch (error) {
      return { error };
    }
  },

  // Real-time subscriptions (optional)
  subscribeToSessionMessages(sessionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`messages:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToUserSessions(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`sessions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};