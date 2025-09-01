import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
  fullScreen?: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoadingContainer = styled(motion.div)<{ fullScreen?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${props => props.fullScreen ? 'min-height: 100vh;' : 'min-height: 200px;'}
  padding: 2rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;
  text-align: center;
`;

const Spinner = styled(motion.div)<{ size: string }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Dot = styled(motion.div)<{ size: string }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '6px';
      case 'large': return '12px';
      default: return '8px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '6px';
      case 'large': return '12px';
      default: return '8px';
    }
  }};
  background: #667eea;
  border-radius: 50%;
`;

const PulseContainer = styled(motion.div)<{ size: string }>`
  width: ${props => {
    switch (props.size) {
      case 'small': return '30px';
      case 'large': return '80px';
      default: return '50px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '30px';
      case 'large': return '80px';
      default: return '50px';
    }
  }};
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
`;

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'medium',
  variant = 'spinner',
  fullScreen = false
}) => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const renderLoadingAnimation = () => {
    switch (variant) {
      case 'dots':
        return (
          <DotsContainer>
            {[0, 1, 2].map((index) => (
              <Dot
                key={index}
                size={size}
                animate={{
                  y: [0, -10, 0],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              />
            ))}
          </DotsContainer>
        );
      
      case 'pulse':
        return (
          <PulseContainer
            size={size}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        );
      
      default: // spinner
        return (
          <Spinner
            size={size}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
    }
  };

  return (
    <LoadingContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      fullScreen={fullScreen}
    >
      {renderLoadingAnimation()}
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingState;