import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  transcribeAudio,
  analyzeSentiment,
  generateResponse,
} from '../services/api';
import Footer from '../components/Footer';

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
          ctx.strokeStyle = 'rgba(249, 142, 84, 0.3)'; // Primary color
          gradient.addColorStop(0, 'rgba(249, 142, 84, 0.2)');
          gradient.addColorStop(1, 'rgba(243, 184, 90, 0.2)');
        } else if (index === 1) {
          ctx.strokeStyle = 'rgba(243, 184, 90, 0.2)'; // Secondary color
          gradient.addColorStop(0, 'rgba(243, 184, 90, 0.15)');
          gradient.addColorStop(1, 'rgba(249, 142, 84, 0.15)');
        } else {
          ctx.strokeStyle = 'rgba(169, 159, 225, 0.2)'; // Accent color
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

// Floating orb component for background effects
const FloatingOrb = styled(motion.div)<{
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    ${(props) => props.color},
    transparent
  );
  opacity: 0.4;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  filter: blur(8px);
  z-index: 0;
`;

// Container for the entire app
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  position: relative;
  background-color: var(--background-color);
`;

// Main content wrapper
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 100px; /* Space for footer */
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
const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isUser ? 'row-reverse' : 'row')};
  align-items: flex-end;
  gap: 0.75rem;
`;

const Avatar = styled.div<{ isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.isUser ? 'var(--primary-light)' : 'var(--secondary-light)'};
  color: white;
  font-weight: 600;
  font-size: 14px;
`;

const MessageBubble = styled(motion.div)<{ isUser: boolean }>`
  padding: 1rem;
  border-radius: 18px;
  background-color: ${(props) =>
    props.isUser ? 'var(--primary-color)' : 'var(--surface-color)'};
  color: ${(props) => (props.isUser ? 'white' : 'var(--text-color)')};
  max-width: 70%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid
    ${(props) => (props.isUser ? 'transparent' : 'rgba(0, 0, 0, 0.05)')};
  position: relative;

  &:before {
    content: '';
    position: absolute;
    bottom: 12px;
    ${(props) => (props.isUser ? 'right: -8px' : 'left: -8px')};
    width: 16px;
    height: 16px;
    background-color: ${(props) =>
      props.isUser ? 'var(--primary-color)' : 'var(--surface-color)'};
    clip-path: ${(props) =>
      props.isUser
        ? 'polygon(0 0, 0% 100%, 100% 100%)'
        : 'polygon(100% 0, 0% 100%, 100% 100%)'};
    border: ${(props) =>
      props.isUser ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'};
    border-radius: 2px;
    transform: ${(props) =>
      props.isUser ? 'rotate(-45deg)' : 'rotate(45deg)'};
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

// SVG icons
const MicrophoneIcon = () => (
  <svg
    width='40'
    height='40'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
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
  <svg
    width='40'
    height='40'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
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
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'>
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
    <svg
      width='180'
      height='180'
      viewBox='0 0 180 180'
      style={{ position: 'absolute', top: '-15px', left: '-15px' }}>
      <circle
        cx='90'
        cy='90'
        r='65'
        fill='none'
        stroke='rgba(255, 255, 255, 0.3)'
        strokeWidth='6'
      />
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
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Array of orb configurations for randomized placement
const orbs = [
  {
    size: 250,
    color: 'var(--primary-light)',
    top: '10%',
    left: '15%',
    delay: 0,
  },
  {
    size: 200,
    color: 'var(--secondary-light)',
    top: '60%',
    left: '75%',
    delay: 1,
  },
  {
    size: 180,
    color: 'var(--accent-color)',
    top: '30%',
    left: '65%',
    delay: 2,
  },
  {
    size: 150,
    color: 'var(--primary-color)',
    top: '70%',
    left: '25%',
    delay: 3,
  },
  {
    size: 120,
    color: 'var(--secondary-color)',
    top: '20%',
    left: '85%',
    delay: 2.5,
  },
];

// Main TherapistApp component
const TherapistApp: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<
    { user?: string; ai?: string }[]
  >([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [lastResponses, setLastResponses] = useState<string[]>([]);

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

  // Improved fallback responses with more variety and depth
  const fallbackResponses = [
    "I understand that must be challenging. Could you tell me more about how that's affecting you?",
    "It sounds like you're going through a lot right now. What aspects of this situation feel most difficult?",
    'I appreciate you sharing that with me. Have you noticed any patterns in when these feelings arise?',
    "That's completely valid to feel that way. What strategies have helped you cope with similar situations before?",
    "I hear you, and it's okay to feel this way. What kind of support would be most helpful for you right now?",
    'Finding meaning is so important. What kinds of activities have made you feel fulfilled in the past?',
    'When you think about a meaningful life, what specific elements come to mind?',
    'It takes courage to explore these questions. What values are most important to you that might guide your search for meaning?',
    "Purpose often emerges from connecting our strengths with others' needs. What are you naturally good at?",
    'Many people find meaning through creative expression, connection with others, or contributing to something larger than themselves. Does any of these resonate with you?',
    'What would a day filled with meaning look like for you? Even imagining it can help us chart a path forward.',
    "Small steps toward meaning can make a big difference. What's one tiny action you could take this week?",
    "The search for meaning is deeply personal. What activities make you lose track of time when you're doing them?",
  ];

  // Auto-scroll chat to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle recording timer
  useEffect(() => {
    if (isListening) {
      const MAX_RECORDING_TIME = 60; // Maximum recording time in seconds

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          // Calculate progress percentage
          const progress = (newTime / MAX_RECORDING_TIME) * 100;
          setRecordingProgress(progress);

          // Auto-stop recording if max time reached
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

  // Start listening/recording function
  const handleStartListening = async () => {
    try {
      // Initialize AudioContext if not already created
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create and configure MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Create a blob from the audio chunks
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });

        // Reset audio chunks
        audioChunksRef.current = [];

        // Process audio with the API
        processAudio(audioBlob);
      };

      // Start recording
      mediaRecorder.start();
      setIsListening(true);
      setError(null);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      setError(
        'Could not access microphone. Please check permissions and try again.'
      );
    }
  };

  // Stop listening/recording function
  const handleStopListening = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    // Stop all media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    setIsListening(false);
  };

  // Process audio function using the API with improved response handling
  const processAudio = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);

      // Transcribe the audio
      const transcribedText = await transcribeAudio(audioBlob);

      // Add user message to chat
      const userMessage: Message = {
        id: Date.now().toString(),
        text: transcribedText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Get AI response with conversation history
      let aiResponseData;
      try {
        // Enhanced contextual prompt that includes conversation style guidance
        const enhancedContext = [
          ...conversationHistory.map((item) => item.user || ''),
          ...conversationHistory.map((item) => item.ai || ''),
          "The AI should respond as a warm, empathetic therapist having a natural conversation. Use varied language, avoid repetitive patterns, and engage authentically with specific details from the user's messages.",
        ];

        aiResponseData = await generateResponse(
          transcribedText,
          enhancedContext
        );

        // Verify the response doesn't exactly match previous responses
        const lastAIResponses = messages
          .filter((m) => !m.isUser)
          .slice(-3)
          .map((m) => m.text);

        // If we got a duplicate response, try again with more guidance
        if (lastAIResponses.includes(aiResponseData.response)) {
          // Add more specific guidance to avoid repetition
          enhancedContext.push(
            'Please provide a completely different response style than before. Be specific and personalized.'
          );
          aiResponseData = await generateResponse(
            transcribedText,
            enhancedContext
          );
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Use enhanced fallback response system when API fails
        aiResponseData = {
          response: generateLocalAIResponse(transcribedText, messages),
        };
      }

      const aiMessage: Message = {
        id: Date.now().toString() + 1,
        text: aiResponseData.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save conversation to history
      saveConversationToHistory(transcribedText, aiResponseData.response);
    } catch (error) {
      console.error('Error processing audio:', error);
      setError(
        'Sorry, there was an error processing your recording. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle text input submission with improved response handling
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    try {
      setIsProcessing(true);

      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentText = inputText;
      setInputText('');

      // Get AI response with conversation history
      let aiResponseData;
      try {
        // Enhanced contextual prompt that includes conversation style guidance
        const enhancedContext = [
          ...conversationHistory.map((item) => item.user || ''),
          ...conversationHistory.map((item) => item.ai || ''),
          "The AI should respond as a warm, empathetic therapist having a natural conversation. Use varied language, avoid repetitive patterns, and engage authentically with specific details from the user's messages.",
        ];

        aiResponseData = await generateResponse(currentText, enhancedContext);

        // Verify the response doesn't exactly match previous responses
        const lastAIResponses = messages
          .filter((m) => !m.isUser)
          .slice(-3)
          .map((m) => m.text);

        // If we got a duplicate response, try again with more guidance
        if (lastAIResponses.includes(aiResponseData.response)) {
          // Add more specific guidance to avoid repetition
          enhancedContext.push(
            'Please provide a completely different response style than before. Be specific and personalized.'
          );
          aiResponseData = await generateResponse(currentText, enhancedContext);
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Use enhanced fallback response system when API fails
        aiResponseData = {
          response: generateLocalAIResponse(currentText, messages),
        };
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseData.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Save conversation to history
      saveConversationToHistory(currentText, aiResponseData.response);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(
        'Sorry, there was an error processing your message. Please try again.'
      );
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

  // Load conversation history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('conversationHistory');
    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));

        // Also populate the messages UI with the last few messages from history
        const savedMessages = JSON.parse(savedHistory);
        if (Array.isArray(savedMessages) && savedMessages.length > 0) {
          const lastMessages = savedMessages.slice(-5); // Get last 5 messages

          const formattedMessages = lastMessages.flatMap((item, index) => {
            const msgs: Message[] = [];
            if (item.user) {
              msgs.push({
                id: `history-user-${index}`,
                text: item.user,
                isUser: true,
              });
            }
            if (item.ai) {
              msgs.push({
                id: `history-ai-${index}`,
                text: item.ai,
                isUser: false,
              });
            }
            return msgs;
          });

          if (formattedMessages.length > 0) {
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    }
  }, []);

  // Save conversation to history
  const saveConversationToHistory = (
    userMessage: string,
    aiResponse: string
  ) => {
    const newHistoryItem = { user: userMessage, ai: aiResponse };
    const updatedHistory = [...conversationHistory, newHistoryItem];
    setConversationHistory(updatedHistory);

    // Save to localStorage for persistence
    localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
  };

  // Enhanced local AI response generation with personality and context awareness
  const generateLocalAIResponse = (
    userMessage: string,
    messageHistory: Message[]
  ): string => {
    // Personality traits for the AI therapist
    const personalityTraits = {
      warmth: [
        'I appreciate you sharing that with me',
        'Thank you for opening up',
        "I'm glad you felt comfortable telling me this",
      ],
      empathy: [
        'That sounds really challenging',
        'I can imagine that might feel overwhelming',
        "It makes sense that you'd feel that way",
      ],
      curiosity: [
        'Could you tell me more about that?',
        'What was that experience like for you?',
        'How did you feel when that happened?',
      ],
      support: [
        "You're showing a lot of courage",
        "You've dealt with this remarkably well",
        'It takes strength to face these feelings',
      ],
      guidance: [
        'Have you considered trying...',
        'Sometimes what helps in situations like this is...',
        'One approach that might be helpful...',
      ],
    };

    // Get last few user messages for context
    const recentUserMessages = messageHistory
      .filter((m) => m.isUser)
      .slice(-3)
      .map((m) => m.text.toLowerCase());

    // Add current message
    recentUserMessages.push(userMessage.toLowerCase());

    // Check for specific topics or emotional content
    const hasMeaningTopic = recentUserMessages.some(
      (msg) =>
        msg.includes('meaning') ||
        msg.includes('purpose') ||
        msg.includes('point')
    );

    const hasAnxietyTopic = recentUserMessages.some(
      (msg) =>
        msg.includes('anx') ||
        msg.includes('worry') ||
        msg.includes('stress') ||
        msg.includes('overwhelm')
    );

    const hasDepressionTopic = recentUserMessages.some(
      (msg) =>
        msg.includes('depress') ||
        msg.includes('sad') ||
        msg.includes('down') ||
        msg.includes('hopeless')
    );

    const hasRelationshipTopic = recentUserMessages.some(
      (msg) =>
        msg.includes('relationship') ||
        msg.includes('partner') ||
        msg.includes('friend') ||
        msg.includes('family') ||
        msg.includes('parent') ||
        msg.includes('child')
    );

    // Choose response elements based on message content
    let responseParts = [];

    // Add personality element (empathy, warmth)
    if (hasDepressionTopic || hasAnxietyTopic) {
      responseParts.push(
        personalityTraits.empathy[
          Math.floor(Math.random() * personalityTraits.empathy.length)
        ]
      );
    } else {
      responseParts.push(
        personalityTraits.warmth[
          Math.floor(Math.random() * personalityTraits.warmth.length)
        ]
      );
    }

    // Add specific content based on detected topic
    if (hasMeaningTopic) {
      const meaningResponses = [
        'Finding meaning often comes from connecting with what truly matters to you. What activities or relationships make you feel most alive?',
        'Many people find that meaning emerges when they align their actions with their core values. What values are most important to you?',
        'Sometimes meaning comes through the impact we have on others. Have you had experiences where you felt your actions made a positive difference?',
      ];
      responseParts.push(
        meaningResponses[Math.floor(Math.random() * meaningResponses.length)]
      );
    } else if (hasAnxietyTopic) {
      const anxietyResponses = [
        'When anxiety is present, grounding techniques can be helpful. Have you tried focusing on your five senses to bring yourself back to the present moment?',
        'Anxiety often involves worrying about future uncertainties. What specific worries have been on your mind lately?',
        "Sometimes anxiety can be reduced by breaking overwhelming situations into smaller, manageable steps. What's one small step you might take?",
      ];
      responseParts.push(
        anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)]
      );
    } else if (hasDepressionTopic) {
      const depressionResponses = [
        'Depression can make everything feel more difficult. Are there any small activities that have brought you even momentary relief?',
        "When we're feeling down, our thinking often becomes more negative and self-critical. Have you noticed any patterns in your thoughts?",
        'Taking care of your basic needs becomes especially important when dealing with depression. How have you been managing self-care?',
      ];
      responseParts.push(
        depressionResponses[
          Math.floor(Math.random() * depressionResponses.length)
        ]
      );
    } else if (hasRelationshipTopic) {
      const relationshipResponses = [
        'Relationships can be both fulfilling and challenging. What aspects of this relationship are most important to you?',
        'Sometimes tensions in relationships reflect different needs or communication styles. Have you been able to express your needs in this situation?',
        "Finding balance between your needs and others' needs can be complicated. How do you typically navigate these kinds of situations?",
      ];
      responseParts.push(
        relationshipResponses[
          Math.floor(Math.random() * relationshipResponses.length)
        ]
      );
    } else {
      // General therapeutic responses for other topics
      const generalResponses = [
        "I'm curious to understand more about your experience. Could you share what that's been like for you?",
        'Thank you for bringing this up. These kinds of conversations can be really valuable. What do you feel would be most helpful to explore further?',
        "I'm hearing that this is important to you. What would you like to focus on as we continue talking?",
        "That's an interesting perspective. How long have you been thinking about this?",
        'I appreciate you sharing that with me. What do you feel is the most challenging aspect of this situation?',
      ];
      responseParts.push(
        generalResponses[Math.floor(Math.random() * generalResponses.length)]
      );
    }

    // Add a follow-up question or supportive statement to encourage continued conversation
    const followUps = [
      ...personalityTraits.curiosity,
      "I'm here to listen whenever you want to talk more about this.",
      "Please feel free to share more whenever you're ready.",
      'What other thoughts or feelings are coming up for you around this?',
    ];

    // Only add follow-up if response isn't already too long
    if (responseParts.join(' ').length < 150) {
      responseParts.push(
        followUps[Math.floor(Math.random() * followUps.length)]
      );
    }

    return responseParts.join(' ');
  };

  return (
    <AppContainer onMouseMove={handleMouseMove}>
      {/* Background orbs */}
      {orbs.map((orb, index) => (
        <FloatingOrb
          key={index}
          size={orb.size}
          color={orb.color}
          top={orb.top}
          left={orb.left}
          delay={orb.delay}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 0.4,
            y: [0, -10, 0],
            x: [0, 5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            opacity: { duration: 1 },
            y: {
              repeat: Infinity,
              duration: 6,
              ease: 'easeInOut',
              delay: orb.delay,
            },
            x: {
              repeat: Infinity,
              duration: 7,
              ease: 'easeInOut',
              delay: orb.delay,
            },
            scale: {
              repeat: Infinity,
              duration: 8,
              ease: 'easeInOut',
              delay: orb.delay,
            },
          }}
        />
      ))}

      {/* Wave animation at the bottom */}
      <WaveCanvas />

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
            </Header>

            <ChatContainer ref={chatContainerRef}>
              <AnimatePresence>
                {messages.map((message) => (
                  <MessageContainer key={message.id} isUser={message.isUser}>
                    <Avatar isUser={message.isUser}>
                      {message.isUser ? 'You' : 'AI'}
                    </Avatar>
                    <MessageBubble
                      isUser={message.isUser}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}>
                      <MessageText>{message.text}</MessageText>
                      <MessageTime
                        color={
                          message.isUser
                            ? 'rgba(255, 255, 255, 0.8)'
                            : undefined
                        }>
                        {formatTime(message.timestamp)}
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
                onClick={
                  isListening ? handleStopListening : handleStartListening
                }
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
                {isListening
                  ? `Listening... ${recordingTime}s`
                  : 'Tap to speak'}
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

      {/* Footer that adjusts with content */}
      <Footer />
    </AppContainer>
  );
};

export default TherapistApp;
