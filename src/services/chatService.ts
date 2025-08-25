import { supabase } from './supabase';
import { dataValidators, sanitizeData } from '../utils/validation';
import { sessionCache, messageCache, localStorageCache } from '../utils/cache';

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

  async getSessions(options: { limit?: number; offset?: number; useCache?: boolean } = {}): Promise<{ data: ChatSession[] | null; error: any }> {
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second
    const { limit = 50, offset = 0, useCache = true } = options;

    // Create cache key based on parameters
    const cacheKey = `sessions_${offset}_${limit}`;

    // Try to get from cache first
    if (useCache && offset === 0) {
      const cached = sessionCache.get(cacheKey);
      if (cached) {
        return { data: cached, error: null };
      }
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { data: null, error: { message: 'User not authenticated' } };
        }

        // First, try to get sessions with last_message_at ordering
        let { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false })
          .range(offset, offset + limit - 1);

        // If last_message_at doesn't exist or causes issues, fallback to created_at
        if (error && error.message.includes('last_message_at')) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('chat_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);
          
          if (!fallbackError && fallbackData) {
            // Ensure last_message_at has a value for each session
            const processedData = fallbackData.map(session => ({
              ...session,
              last_message_at: session.last_message_at || session.created_at
            }));
            
            const validatedData = sanitizeData.chatSessions(processedData);
            if (useCache && offset === 0) {
              sessionCache.set(cacheKey, validatedData);
              localStorageCache.set('cached_chat_sessions', validatedData, 30 * 60 * 1000);
            }
            return { data: validatedData, error: null };
          }
          
          return { data: fallbackData, error: fallbackError };
        }

        // Validate and sanitize session data
        if (data) {
          const validatedData = sanitizeData.chatSessions(data);
          if (useCache && offset === 0) {
            sessionCache.set(cacheKey, validatedData);
            localStorageCache.set('cached_chat_sessions', validatedData, 30 * 60 * 1000);
          }
          return { data: validatedData, error: null };
        }

        return { data: [], error: null };
      } catch (error) {
        if (attempt === maxRetries) {
          console.error('Failed to load sessions after', maxRetries, 'attempts:', error);
          // Try to return cached data on error
          const cached = localStorageCache.get('cached_chat_sessions');
          if (cached) {
            return { data: cached, error: null };
          }
          return { data: null, error };
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
    
    return { data: null, error: { message: 'Failed to load sessions' } };
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
  async getMessages(sessionId: string, options: { limit?: number; offset?: number; useCache?: boolean } = {}): Promise<{ data: ChatMessage[] | null; error: any }> {
    const maxRetries = 3;
    const retryDelay = 800; // 800ms
    const { limit = 100, offset = 0, useCache = true } = options;

    // Create cache key based on session and parameters
    const cacheKey = `messages_${sessionId}_${offset}_${limit}`;

    // Try to get from cache first
    if (useCache && offset === 0) {
      const cached = messageCache.get(cacheKey);
      if (cached) {
        return { data: cached, error: null };
      }
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return { data: null, error: { message: 'User not authenticated' } };
        }

        // Validate sessionId
        if (!sessionId || typeof sessionId !== 'string') {
          return { data: null, error: { message: 'Invalid session ID' } };
        }

        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', sessionId)
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .range(offset, offset + limit - 1);

        if (error) {
          console.warn(`Attempt ${attempt} failed for getMessages:`, error);
          if (attempt === maxRetries) {
            return { data: null, error };
          }
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          continue;
        }

        // Validate and sanitize message data
        if (data) {
          const validatedData = sanitizeData.chatMessages(data);
          if (useCache && offset === 0) {
            messageCache.set(cacheKey, validatedData);
          }
          return { data: validatedData, error: null };
        }

        return { data: [], error: null };
      } catch (error) {
        console.error(`Attempt ${attempt} failed with exception:`, error);
        if (attempt === maxRetries) {
          return { data: null, error: { message: 'Failed to load messages after multiple attempts' } };
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
    
    return { data: null, error: { message: 'Failed to load messages' } };
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