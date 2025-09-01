import { supabase } from './supabase';
import { dataValidators, sanitizeData } from '../utils/validation';

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

// Simple in-memory cache to avoid redundant API calls
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCached = (key: string) => {
  const item = cache.get(key);
  if (!item || Date.now() > item.timestamp + item.ttl) {
    cache.delete(key);
    return null;
  }
  return item.data;
};

const setCache = (key: string, data: any, ttl: number = 60000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
  // Limit cache size
  if (cache.size > 50) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
};

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

      if (!error && session) {
        // Clear sessions cache
        cache.delete(`sessions_${user.id}`);
      }

      return { data: session, error };
    } catch (error) {
      console.error('Create session error:', error);
      return { data: null, error };
    }
  },

  async getSessions(options: { limit?: number; offset?: number; useCache?: boolean } = {}): Promise<{ data: ChatSession[] | null; error: any }> {
    const { limit = 50, offset = 0, useCache = true } = options;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const cacheKey = `sessions_${user.id}_${offset}_${limit}`;

      // Try cache first (only for first page)
      if (useCache && offset === 0) {
        const cached = getCached(cacheKey);
        if (cached) {
          return { data: cached, error: null };
        }
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get sessions error:', error);
        return { data: null, error };
      }

      // Process and validate data
      const processedData = (data || []).map(session => ({
        ...session,
        last_message_at: session.last_message_at || session.created_at,
        updated_at: session.updated_at || session.created_at
      }));

      const validatedData = sanitizeData.chatSessions(processedData);

      // Cache only first page
      if (useCache && offset === 0) {
        setCache(cacheKey, validatedData, 120000); // 2 minutes
      }

      return { data: validatedData, error: null };
    } catch (error) {
      console.error('Get sessions exception:', error);
      return { data: null, error };
    }
  },

  async getSession(sessionId: string): Promise<{ data: ChatSession | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      if (!sessionId || typeof sessionId !== 'string') {
        return { data: null, error: { message: 'Invalid session ID' } };
      }

      const cacheKey = `session_${sessionId}`;
      const cached = getCached(cacheKey);
      if (cached) {
        return { data: cached, error: null };
      }

      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Get session error:', error);
        return { data: null, error };
      }

      const processedSession = {
        ...data,
        last_message_at: data.last_message_at || data.created_at,
        updated_at: data.updated_at || data.created_at
      };

      setCache(cacheKey, processedSession, 300000); // 5 minutes

      return { data: processedSession, error: null };
    } catch (error) {
      console.error('Get session exception:', error);
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

      if (!error && data) {
        // Clear relevant caches
        cache.delete(`session_${sessionId}`);
        cache.delete(`sessions_${user.id}`);
      }

      return { data, error };
    } catch (error) {
      console.error('Update session error:', error);
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

      if (!error) {
        // Clear relevant caches
        cache.delete(`session_${sessionId}`);
        cache.delete(`sessions_${user.id}`);
        cache.delete(`messages_${sessionId}`);
      }

      return { error };
    } catch (error) {
      console.error('Delete session error:', error);
      return { error };
    }
  },

  // Message Management
  async getMessages(sessionId: string, options: { limit?: number; offset?: number; useCache?: boolean } = {}): Promise<{ data: ChatMessage[] | null; error: any }> {
    const { limit = 100, offset = 0, useCache = true } = options;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { data: null, error: { message: 'User not authenticated' } };
      }

      if (!sessionId || typeof sessionId !== 'string') {
        return { data: null, error: { message: 'Invalid session ID' } };
      }

      const cacheKey = `messages_${sessionId}_${offset}_${limit}`;

      // Try cache first (only for first page)
      if (useCache && offset === 0) {
        const cached = getCached(cacheKey);
        if (cached) {
          return { data: cached, error: null };
        }
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Get messages error:', error);
        return { data: null, error };
      }

      const validatedData = sanitizeData.chatMessages(data || []);

      // Cache only first page
      if (useCache && offset === 0) {
        setCache(cacheKey, validatedData, 60000); // 1 minute
      }

      return { data: validatedData, error: null };
    } catch (error) {
      console.error('Get messages exception:', error);
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

      if (!error && data) {
        // Clear messages cache
        cache.delete(`messages_${sessionId}`);
      }

      return { data, error };
    } catch (error) {
      console.error('Add message error:', error);
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
      console.error('Delete message error:', error);
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