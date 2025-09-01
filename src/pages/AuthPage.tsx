import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SignInForm from '../components/auth/SignInForm';
import SignUpForm from '../components/auth/SignUpForm';
import { useNavigate } from 'react-router-dom';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundElements = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
`;

const FloatingShape = styled(motion.div)<{
  size: number;
  color: string;
  top: string;
  left: string;
}>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background: ${(props) => props.color};
  opacity: 0.1;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
`;

const WelcomeText = styled(motion.div)`
  text-align: center;
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const WelcomeSubtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.5;
`;

const shapes = [
  { size: 200, color: '#303064', top: '10%', left: '10%' },
  { size: 150, color: '#f98e54', top: '20%', left: '80%' },
  { size: 100, color: '#303064', top: '60%', left: '15%' },
  { size: 180, color: '#f98e54', top: '70%', left: '75%' },
  { size: 120, color: '#303064', top: '40%', left: '85%' },
];

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/app');
  };

  return (
    <PageContainer>
      <BackgroundElements>
        {shapes.map((shape, index) => (
          <FloatingShape
            key={index}
            size={shape.size}
            color={shape.color}
            top={shape.top}
            left={shape.left}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.5,
            }}
          />
        ))}
      </BackgroundElements>

      <ContentContainer>
        <WelcomeText
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>
          <WelcomeTitle>Welcome to TherHappy</WelcomeTitle>
          <WelcomeSubtitle>
            Your AI companion for mental wellness and emotional support
          </WelcomeSubtitle>
        </WelcomeText>

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
      </ContentContainer>
    </PageContainer>
  );
};

export default AuthPage;