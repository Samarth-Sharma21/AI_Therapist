import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { chatService, ChatSession } from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from './LoadingState';

const Container = styled.div`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #303064;
  font-size: 1.3rem;
  flex: 1;
`;

const NewChatButton = styled(motion.button)`
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SessionsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
`;

const SessionItem = styled(motion.div)<{ $isActive: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${props => props.$isActive ? '#f98e54' : 'rgba(0, 0, 0, 0.05)'};
  background-color: ${props => props.$isActive ? 'rgba(249, 142, 84, 0.05)' : 'transparent'};
  position: relative;
  
  &:hover {
    background-color: ${props => props.$isActive ? 'rgba(249, 142, 84, 0.1)' : 'rgba(0, 0, 0, 0.02)'};
    border-color: ${props => props.$isActive ? '#f98e54' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const SessionTitle = styled.div`
  font-weight: 500;
  color: #303064;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
  line-height: 1.3;
  word-break: break-word;
`;

const SessionDate = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

const SessionActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${SessionItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  background: ${props => props.$variant === 'delete' ? '#e74c3c' : '#666'};
  color: white;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.7rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${props => props.$variant === 'delete' ? '#c0392b' : '#555'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  
  h3 {
    margin-bottom: 0.5rem;
    color: #303064;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const EditInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #f98e54;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #303064;
  background: white;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(249, 142, 84, 0.2);
  }
`;

const ErrorState = styled.div`
  color: #e74c3c; 
  text-align: center; 
  padding: 1rem;
  background: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin: 0.5rem 0;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  small {
    display: block;
    margin-top: 0.5rem;
  }
`;

const RefreshButton = styled(motion.button)`
  background: #f98e54;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface ChatSessionListProps {
  activeSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatSessionList: React.FC<ChatSessionListProps> = ({
  activeSessionId,
  onSessionSelect,
  onNewChat
}) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const { user, loading: authLoading } = useAuth();

  const loadSessions = useCallback(async () => {
    if (!user || authLoading) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await chatService.getSessions();
      
      if (error) {
        console.error('Error loading sessions:', error);
        setError(error.message || 'Failed to load chat sessions');
        setSessions([]);
      } else {
        setSessions(data || []);
      }
    } catch (err: any) {
      console.error('Exception loading sessions:', err);
      setError(err.message || 'Failed to load chat sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user && !authLoading) {
      loadSessions();
    } else if (!authLoading) {
      // Not authenticated, clear sessions
      setSessions([]);
      setLoading(false);
    }
  }, [user, authLoading, loadSessions]);

  const handleNewChat = async () => {
    if (creating) return;
    
    try {
      setCreating(true);
      const { data, error } = await chatService.createSession({
        title: 'New Chat Session'
      });
      
      if (error) {
        console.error('Error creating session:', error);
        setError('Failed to create new chat session');
      } else if (data) {
        setSessions(prev => [data, ...prev]);
        onNewChat();
        onSessionSelect(data.id);
      }
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Failed to create new chat session');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this chat session?')) {
      return;
    }
    
    try {
      const { error } = await chatService.deleteSession(sessionId);
      
      if (error) {
        console.error('Error deleting session:', error);
        setError('Failed to delete session');
      } else {
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        
        // If we deleted the active session, clear it
        if (activeSessionId === sessionId) {
          onSessionSelect('');
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session');
    }
  };

  const handleEditStart = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const handleEditSave = async (sessionId: string) => {
    if (!editingTitle.trim()) {
      setEditingId(null);
      return;
    }
    
    try {
      const { error } = await chatService.updateSession(sessionId, {
        title: editingTitle.trim()
      });
      
      if (error) {
        console.error('Error updating session:', error);
        setError('Failed to update session title');
      } else {
        setSessions(prev =>
          prev.map(session =>
            session.id === sessionId
              ? { ...session, title: editingTitle.trim() }
              : session
          )
        );
      }
    } catch (err) {
      console.error('Error updating session title:', err);
      setError('Failed to update session title');
    } finally {
      setEditingId(null);
      setEditingTitle('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent, sessionId: string) => {
    if (e.key === 'Enter') {
      handleEditSave(sessionId);
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch {
      return 'Recently';
    }
  };

  const handleRefresh = () => {
    setError(null);
    loadSessions();
  };

  if (authLoading) {
    return (
      <Container>
        <LoadingState message="Initializing..." size="medium" variant="spinner" />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <EmptyState>
          <h3>Please sign in</h3>
          <p>Sign in to view your chat sessions.</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Chat History</Title>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <NewChatButton
            onClick={handleNewChat}
            disabled={creating}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}>
            {creating ? '...' : '+ New Chat'}
          </NewChatButton>
          {error && (
            <RefreshButton
              onClick={handleRefresh}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              ↻
            </RefreshButton>
          )}
        </div>
      </Header>
      
      <SessionsList>
        {error && (
          <ErrorState>
            <strong>Error:</strong> {error}
            <small>Try refreshing or check your connection</small>
          </ErrorState>
        )}

        {loading ? (
          <LoadingState message="Loading your chat sessions..." size="medium" variant="spinner" />
        ) : sessions.length === 0 && !error ? (
          <EmptyState>
            <h3>No chat sessions yet</h3>
            <p>Start your first conversation by clicking "New Chat" above.</p>
          </EmptyState>
        ) : (
          <AnimatePresence>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                $isActive={session.id === activeSessionId}
                onClick={() => onSessionSelect(session.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}>
                
                {editingId === session.id ? (
                  <EditInput
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => handleEditSave(session.id)}
                    onKeyPress={(e) => handleEditKeyPress(e, session.id)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <SessionTitle>{session.title}</SessionTitle>
                )}
                
                <SessionDate>
                  {formatDate(session.last_message_at)}
                </SessionDate>
                
                {editingId !== session.id && (
                  <SessionActions>
                    <ActionButton
                      onClick={(e) => handleEditStart(session, e)}
                      title="Rename">
                      ✎
                    </ActionButton>
                    <ActionButton
                      $variant="delete"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      title="Delete">
                      ×
                    </ActionButton>
                  </SessionActions>
                )}
              </SessionItem>
            ))}
          </AnimatePresence>
        )}
      </SessionsList>
    </Container>
  );
};

export default ChatSessionList;