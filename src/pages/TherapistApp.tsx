import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  transcribeAudio,
  generateResponse,
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { chatService, ChatSession, ChatMessage } from '../services/chatService';
import ChatSessionList from '../components/ChatSessionList';

// 3D Wave animation component
const WaveCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 300;

    const waves = [
      { y: 0.5, length: 0.01, amplitude: 20, speed: 0.01 },
      { y: 0.5, length: 0.02, amplitude: 15, speed: 0.02 },
      { y: 0.5, length: 0.015, amplitude: 10, speed: 0.015 },
    ];

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      waves.forEach((wave, index) => {
        ctx.beginPath();

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        if (index === 0) {
          ctx.strokeStyle = 'rgba(249, 142, 84, 0.3)';
          gradient.addColorStop(0, 'rgba(249, 142, 84, 0.2)');
          gradient.addColorStop(1, 'rgba(243, 184, 90, 0.2)');
        } else if (index === 1) {
          ctx.strokeStyle = 'rgba(243, 184, 90, 0.2)';
          gradient.addColorStop(0, 'rgba(243, 184, 90, 0.15)');
          gradient.addColorStop(1, 'rgba(249, 142, 84, 0.15)');
        } else {
          ctx.strokeStyle = 'rgba(169, 159, 225, 0.2)';
          gradient.addColorStop(0, 'rgba(169, 159, 225, 0.1)');
          gradient.addColorStop(1, 'rgba(243, 184, 90, 0.1)');
        }

        ctx.fillStyle = gradient;
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x++) {
          const dx = x * wave.length;
          const y =
            Math.sin(dx + time * wave.speed) * wave.amplitude +
            canvas.height * wave.y;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      time += 0.05;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 300;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '300px',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

// Container for the entire app
const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  background-color: var(--background-color);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

// Sidebar for chat sessions
const Sidebar = styled(motion.div)<{ $isOpen?: boolean }>`
  width: 350px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.$isOpen ? '0' : '-350px'};
    height: 100vh;
    width: 280px;
    z-index: 1000;
    transition: left 0.3s ease;
    box-shadow: ${props => props.$isOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'};
  }
  
  @media (max-width: 480px) {
    width: 100vw;
    left: ${props => props.$isOpen ? '0' : '-100vw'};
  }
`;

// Mobile overlay
const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

// Mobile hamburger button
const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 20px;
    left: 20px;
    width: 50px;
    height: 50px;
    background: rgba(249, 142, 84, 0.9);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    z-index: 1001;
    box-shadow: 0 4px 15px rgba(249, 142, 84, 0.3);
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

// Main content wrapper
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

// 3D container with perspective for mouse movement effects
const TherapySection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
  perspective: 1000px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 80px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-top: 80px;
  }
`;

// Card container for main content with 3D movement
const CardContainer = styled(motion.div)`
  background-color: var(--surface-color);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05), 0 1px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

// Header for the app
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
`;

const SessionTitle = styled.div`
  background: rgba(249, 142, 84, 0.1);
  color: #303064;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Chat container for messages
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
  margin-bottom: 1rem;
  max-height: 400px;

  /* Scrollbar styling */
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

// Message components with different styles for user and AI
const MessageContainer = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isUser ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 0.75rem;
`;

const Avatar = styled.div<{ $isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.$isUser ? 'var(--primary-light)' : 'var(--secondary-light)'};
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const MessageBubble = styled(motion.div)<{ $isUser: boolean }>`
  padding: 1rem;
  border-radius: 18px;
  background-color: ${(props) =>
    props.$isUser ? 'var(--primary-color)' : 'var(--surface-color)'};
  color: ${(props) => (props.$isUser ? 'white' : 'var(--text-color)')};
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid
    ${(props) => (props.$isUser ? 'transparent' : 'rgba(0, 0, 0, 0.05)')};
  position: relative;

  &:before {
    content: '';
    position: absolute;
    bottom: 12px;
    ${(props) => (props.$isUser ? 'right: -8px' : 'left: -8px')};
    width: 16px;
    height: 16px;
    background-color: ${(props) =>
      props.$isUser ? 'var(--primary-color)' : 'var(--surface-color)'};
    clip-path: ${(props) =>
      props.$isUser
        ? 'polygon(0 0, 0% 100%, 100% 100%)'
        : 'polygon(100% 0, 0% 100%, 100% 100%)'};
    border: ${(props) =>
      props.$isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'};
    border-radius: 2px;
    transform: ${(props) =>
      props.$isUser ? 'rotate(-45deg)' : 'rotate(45deg)'};
  }
`;

const MessageText = styled.p`
  margin: 0;
  line-height: 1.5;
  font-size: 1rem;
`;

const MessageTime = styled.span`
  font-size: 0.7rem;
  color: ${(props) => props.color || 'var(--text-light)'};
  display: block;
  margin-top: 0.5rem;
  text-align: right;
`;

// Voice chat bubble - the main focus for audio interaction
const VoiceBubbleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
`;

const VoiceBubble = styled(motion.button)<{ isListening: boolean }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${(props) =>
    props.isListening
      ? 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))'
      : 'linear-gradient(135deg, var(--primary-light), var(--secondary-light))'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  box-shadow: 0 10px 30px rgba(243, 184, 90, 0.3);
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 50%;
    z-index: -1;
    opacity: 0.7;
  }

  &:hover {
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
  
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    
    svg {
      width: 28px;
      height: 28px;
    }
  }
`;

const VoiceStatus = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 500;
  text-align: center;
`;

// Text input section (secondary option)
const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InputField = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  background-color: white;
  outline: none;
  transition: border-color 0.2s ease;
  color: var(--text-color);

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(249, 142, 84, 0.2);
  }

  &::placeholder {
    color: var(--text-light);
    opacity: 0.7;
  }

  &:disabled {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Thinking indicator animation for waiting states
const ThinkingIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background-color: var(--surface-color);
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-left: 3rem;
`;

const ThinkingDot = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
`;

// Welcome message for new sessions
const WelcomeMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
  
  h2 {
    color: #303064;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0;
    line-height: 1.6;
    font-size: 1.1rem;
  }
`;

// Loading state for messages
const MessagesLoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
  
  .spinner {
    display: inline-block;
    margin-right: 0.5rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Icons components
const MicrophoneIcon = () => (
  <svg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M12 15C13.6569 15 15 13.6569 15 12V6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6V12C9 13.6569 10.3431 15 12 15Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />
    <path
      d='M19 10V12C19 15.866 15.866 19 12 19M12 19C8.13401 19 5 15.866 5 12V10M12 19V22M8 22H16'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const StopIcon = () => (
  <svg width='40' height='40' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <rect
      x='6'
      y='6'
      width='12'
      height='12'
      rx='1'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='currentColor'
    />
  </svg>
);

const SendIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

// Progress ring for recording visualization
const ProgressRing = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 65;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <svg width='180' height='180' viewBox='0 0 180 180' style={{ position: 'absolute', top: '-15px', left: '-15px' }}>
      <circle cx='90' cy='90' r='65' fill='none' stroke='rgba(255, 255, 255, 0.3)' strokeWidth='6' />
      <circle
        cx='90'
        cy='90'
        r='65'
        fill='none'
        stroke='white'
        strokeWidth='6'
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform='rotate(-90 90 90)'
        strokeLinecap='round'
      />
    </svg>
  );
};

// Audio Wave Animation for voice visualization
const AudioWaveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const AudioWaveBar = styled(motion.div)`
  width: 4px;
  height: 20px;
  background-color: white;
  border-radius: 2px;
`;

const AudioWave = () => {
  return (
    <AudioWaveContainer>
      {[...Array(5)].map((_, i) => (
        <AudioWaveBar
          key={i}
          initial={{ height: 20 }}
          animate={{
            height: [20, 40, 10, 30, 20],
            opacity: [0.7, 1, 0.8, 0.9, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </AudioWaveContainer>
  );
};

// Format timestamp for messages
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Interface for message structure
interface Message {
  id: string;
  content: string;
  is_user_message: boolean;
  created_at: string;
}

// Main TherapistApp component
const TherapistApp: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // 3D mouse interaction effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [0, window.innerHeight], [2, -2]);
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-2, 2]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Auto-scroll chat to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle recording timer and cleanup
  useEffect(() => {
    if (isListening) {
      const MAX_RECORDING_TIME = 60;

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          const progress = (newTime / MAX_RECORDING_TIME) * 100;
          setRecordingProgress(progress);

          if (newTime >= MAX_RECORDING_TIME) {
            handleStopListening();
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
      setRecordingProgress(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isListening]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up any active recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // Clean up media stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });
      }
      
      // Clean up audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
      
      // Clear timers
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      
      // Clear any pending blob URLs
      audioChunksRef.current = [];
    };
  }, []);

  // Load messages when session changes
  const loadMessages = useCallback(async (sessionId: string) => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    setError(null);
    
    try {
      const { data, error } = await chatService.getMessages(sessionId);
      
      if (error) {
        console.error('Error loading messages:', error);
        setError('Failed to load messages. Please try again.');
        setMessages([]);
      } else {
        setMessages(data || []);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages. Please refresh the page.');
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (currentSession?.id) {
      loadMessages(currentSession.id);
    } else {
      setMessages([]);
      setLoadingMessages(false);
    }
  }, [currentSession?.id, loadMessages]);

  // Initialize session management - only load last session once
  useEffect(() => {
    if (!user || authLoading || sessionInitialized) return;

    const initializeSession = async () => {
      try {
        // Check for last active session
        const lastSessionId = sessionStorage.getItem('current_session_id') ||
                             localStorage.getItem('last_active_session');
        
        if (lastSessionId) {
          const { data: sessionData, error } = await chatService.getSession(lastSessionId);
          if (!error && sessionData) {
            setCurrentSession(sessionData);
            sessionStorage.setItem('current_session_id', sessionData.id);
            localStorage.setItem('last_active_session', sessionData.id);
          } else {
            // Session doesn't exist or error, clear invalid references
            sessionStorage.removeItem('current_session_id');
            localStorage.removeItem('last_active_session');
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        // Clear invalid session references
        sessionStorage.removeItem('current_session_id');
        localStorage.removeItem('last_active_session');
      } finally {
        setSessionInitialized(true);
      }
    };

    initializeSession();
  }, [user, authLoading, sessionInitialized]);

  // Session management functions
  const handleSessionSelect = useCallback(async (sessionId: string) => {
    if (sessionId === currentSession?.id) return; // Avoid reloading same session
    
    if (sessionId) {
      const { data, error } = await chatService.getSession(sessionId);
      if (error) {
        console.error('Error loading session:', error);
        setError('Failed to load session');
      } else {
        setCurrentSession(data);
        sessionStorage.setItem('current_session_id', sessionId);
        localStorage.setItem('last_active_session', sessionId);
        setSidebarOpen(false); // Close sidebar on mobile
      }
    } else {
      setCurrentSession(null);
      sessionStorage.removeItem('current_session_id');
      localStorage.removeItem('last_active_session');
    }
  }, [currentSession?.id]);

  const handleNewChat = useCallback(async () => {
    try {
      const { data, error } = await chatService.createSession({
        title: 'New Chat Session'
      });
      
      if (error) {
        console.error('Error creating session:', error);
        setError('Failed to create new session');
      } else if (data) {
        setCurrentSession(data);
        setMessages([]);
        sessionStorage.setItem('current_session_id', data.id);
        localStorage.setItem('last_active_session', data.id);
        setSidebarOpen(false); // Close sidebar on mobile
      }
    } catch (err) {
      console.error('Error creating new chat:', err);
      setError('Failed to create new session');
    }
  }, []);

  // Start listening/recording function
  const handleStartListening = async () => {
    try {
      // Clear any previous error states
      setError(null);
      setIsProcessing(false);

      // Initialize AudioContext for better browser compatibility
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || 
          (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
          // Resume AudioContext if it's suspended (Chrome requirement)
          if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
          }
        }
      }

      // Request microphone access with optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000 // Optimize for speech recognition
        } 
      });
      mediaStreamRef.current = stream;

      // Configure MediaRecorder with better Chrome compatibility
      const options: MediaRecorderOptions = {
        mimeType: 'audio/webm;codecs=opus', // Better Chrome support
        audioBitsPerSecond: 128000 // Reasonable quality for speech
      };

      // Fallback MIME types for compatibility
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          options.mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options.mimeType = 'audio/mp4';
        } else {
          delete options.mimeType; // Use default
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create blob with proper type
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        // Clear chunks immediately to free memory
        audioChunksRef.current = [];
        
        // Process audio with proper error handling
        if (audioBlob.size > 0) {
          processAudio(audioBlob);
        } else {
          setError('No audio was recorded. Please try again.');
          setIsProcessing(false);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error. Please try again.');
        setIsListening(false);
        setIsProcessing(false);
      };

      // Start recording with time slicing for better Chrome performance
      mediaRecorder.start(1000); // Collect data every second
      setIsListening(true);
      setError(null);
    } catch (error: any) {
      console.error('Error starting audio recording:', error);
      
      // Provide more specific error messages
      if (error.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access and try again.');
      } else if (error.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone and try again.');
      } else if (error.name === 'NotSupportedError') {
        setError('Recording is not supported in your browser. Please try typing your message.');
      } else {
        setError('Could not access microphone. Please check permissions and try again.');
      }
      
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  // Stop listening/recording function
  const handleStopListening = () => {
    try {
      // Stop the MediaRecorder if it's active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Clean up media stream tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false; // Ensure track is fully disabled
        });
        mediaStreamRef.current = null;
      }

      // Clean up MediaRecorder reference
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current = null;
      }

      setIsListening(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setError('Error stopping recording. The audio may still be processed.');
      setIsListening(false);
    }
  };

  // Process audio function using the API
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Validate blob size
      if (audioBlob.size === 0) {
        throw new Error('No audio data recorded');
      }

      if (audioBlob.size < 1000) { // Less than 1KB is likely empty
        throw new Error('Recording too short. Please speak for at least 1 second.');
      }

      // Add timeout to prevent infinite loading
      const transcriptionPromise = transcribeAudio(audioBlob);
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Transcription timeout. Please try again.'));
        }, 15000); // 15 second timeout
      });

      const transcribedText = await Promise.race([transcriptionPromise, timeoutPromise]);
      
      if (transcribedText && transcribedText.trim()) {
        await addMessageAndGetResponse(transcribedText);
      } else {
        throw new Error('No speech detected in recording');
      }
    } catch (error: any) {
      console.error('Error processing audio:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('timeout')) {
        setError('Recording processing took too long. Please try again with a shorter message.');
      } else if (error.message.includes('No speech detected')) {
        setError('No speech was detected in your recording. Please try speaking again.');
      } else if (error.message.includes('too short')) {
        setError('Recording too short. Please speak for at least 1 second.');
      } else {
        setError('Sorry, there was an error processing your recording. Please try again or type your message.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text input submission
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const messageText = inputText;
    setInputText('');
    
    await addMessageAndGetResponse(messageText);
  };

  // Add message and get AI response
  const addMessageAndGetResponse = async (messageText: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Create session if none exists
      let sessionToUse = currentSession;
      if (!sessionToUse) {
        const { data, error } = await chatService.createSession({
          title: 'New Chat Session'
        });
        
        if (error) {
          throw new Error('Failed to create session');
        }
        
        sessionToUse = data;
        setCurrentSession(data);
        if (data) {
          sessionStorage.setItem('current_session_id', data.id);
          localStorage.setItem('last_active_session', data.id);
        }
      }

      if (!sessionToUse) {
        throw new Error('No active session');
      }

      // Add user message
      const { data: userMessage, error: userError } = await chatService.addMessage(
        sessionToUse.id,
        messageText,
        true
      );

      if (userError) {
        throw new Error('Failed to save user message');
      }

      if (userMessage) {
        setMessages(prev => [...prev, userMessage]);
      }

      // Update session title if this is the first message
      if (messages.length === 0) {
        const title = await chatService.generateSessionTitle(messageText);
        await chatService.updateSession(sessionToUse.id, { title });
        setCurrentSession(prev => prev ? { ...prev, title } : null);
      }

      // Get AI response
      const conversationHistory = messages.map(msg => ({
        user: msg.is_user_message ? msg.content : undefined,
        ai: !msg.is_user_message ? msg.content : undefined,
      })).filter(item => item.user || item.ai);

      const aiResponseText = await generateResponse(messageText, undefined, conversationHistory);

      // Add AI message
      const { data: aiMessage, error: aiError } = await chatService.addMessage(
        sessionToUse.id,
        aiResponseText,
        false
      );

      if (aiError) {
        throw new Error('Failed to save AI message');
      }

      if (aiMessage) {
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Sorry, there was an error processing your message. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Enter key press for text input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f8f9fa',
      }}>
        <div style={{ color: '#303064', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Protected route should handle this
  }

  return (
    <AppContainer onMouseMove={handleMouseMove}>
      <WaveCanvas />
      
      {/* Mobile Hamburger Menu Button */}
      <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </MobileMenuButton>

      {/* Mobile Overlay */}
      <MobileOverlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar
        $isOpen={sidebarOpen}
        initial={{ x: -350 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}>
        <ChatSessionList
          activeSessionId={currentSession?.id}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        />
      </Sidebar>

      <MainContent>
        <TherapySection>
          <CardContainer
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>
            
            <Header>
              <Title>TherHappy</Title>
              {currentSession && <SessionTitle>{currentSession.title}</SessionTitle>}
            </Header>

            <ChatContainer ref={chatContainerRef}>
              {!currentSession && !loadingMessages && (
                <WelcomeMessage>
                  <h2>Welcome to TherHappy! 👋</h2>
                  <p>
                    I'm here to provide a safe space for you to share your thoughts and feelings.
                    Start a new chat or select a previous conversation from the sidebar to continue.
                  </p>
                </WelcomeMessage>
              )}

              {loadingMessages && (
                <MessagesLoadingState>
                  <span className="spinner">⟳</span>
                  Loading messages...
                </MessagesLoadingState>
              )}

              <AnimatePresence>
                {messages.map((message) => (
                  <MessageContainer key={message.id} $isUser={message.is_user_message}>
                    <Avatar $isUser={message.is_user_message}>
                      {message.is_user_message ? 'You' : 'AI'}
                    </Avatar>
                    <MessageBubble
                      $isUser={message.is_user_message}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}>
                      <MessageText>{message.content}</MessageText>
                      <MessageTime
                        color={message.is_user_message ? 'rgba(255, 255, 255, 0.8)' : undefined}>
                        {formatTime(new Date(message.created_at))}
                      </MessageTime>
                    </MessageBubble>
                  </MessageContainer>
                ))}

                {isProcessing && (
                  <ThinkingIndicator
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <ThinkingDot
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    />
                    <ThinkingDot
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <ThinkingDot
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </ThinkingIndicator>
                )}
              </AnimatePresence>
            </ChatContainer>

            {error && (
              <div
                style={{
                  color: 'var(--error-color)',
                  margin: '0.5rem 0',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                }}>
                {error}
              </div>
            )}

            {/* Voice chat bubble - primary interaction method */}
            <VoiceBubbleContainer>
              <VoiceBubble
                isListening={isListening}
                onClick={isListening ? handleStopListening : handleStartListening}
                disabled={isProcessing}
                whileTap={{ scale: 0.95 }}
                animate={
                  isListening
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          '0 10px 30px rgba(243, 184, 90, 0.3)',
                          '0 15px 40px rgba(243, 184, 90, 0.5)',
                          '0 10px 30px rgba(243, 184, 90, 0.3)',
                        ],
                      }
                    : {}
                }
                transition={{
                  repeat: isListening ? Infinity : 0,
                  duration: 2,
                }}>
                {isListening ? <StopIcon /> : <MicrophoneIcon />}
                {isListening && <ProgressRing progress={recordingProgress} />}
                {isListening && <AudioWave />}
              </VoiceBubble>

              <VoiceStatus>
                {isListening ? `Listening... ${recordingTime}s` : 'Tap to speak'}
              </VoiceStatus>
            </VoiceBubbleContainer>

            {/* Text input as a secondary option */}
            <InputSection>
              <InputContainer>
                <InputField
                  type='text'
                  placeholder='Or type your message here...'
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isListening || isProcessing}
                />

                <SendButton
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isListening || isProcessing}>
                  <SendIcon />
                </SendButton>
              </InputContainer>
            </InputSection>
          </CardContainer>
        </TherapySection>
      </MainContent>
    </AppContainer>
  );
};

export default TherapistApp;