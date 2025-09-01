import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e1e5e9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #666;
  z-index: 1001;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #f98e54;
    color: #f98e54;
  }
`;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signin',
  onSuccess 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOverlayClick}>
          <ModalContent
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}>
            <CloseButton onClick={onClose}>×</CloseButton>
            
            {mode === 'signin' ? (
              <SignInForm
                onSwitchToSignUp={() => setMode('signup')}
                onSuccess={handleSuccess}
              />
            ) : (
              <SignUpForm
                onSwitchToSignIn={() => setMode('signin')}
                onSuccess={handleSuccess}
              />
            )}
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;