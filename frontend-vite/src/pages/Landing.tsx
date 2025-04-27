import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BrainAnimation from '../components/BrainAnimation';

// Styled components
const LandingContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
  z-index: 1;
`;

const BackgroundParticles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Particle = styled(motion.div)<{ size: number; color: string }>`
  position: absolute;
  border-radius: 50%;
  background: ${(props) => props.color};
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  opacity: 0.4;
`;

const GradientOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    transparent 10%,
    rgba(255, 255, 255, 0.95) 70%
  );
  z-index: 0;
  pointer-events: none;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 80px; /* Account for navbar */
  position: relative;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    gap: 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    flex: 1;
  }
`;

const HeroAnimationContainer = styled.div`
  position: relative;
  z-index: 1;

  @media (min-width: 768px) {
    flex: 1;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CTAButton = styled(motion(Link))`
  display: inline-block;
  background-color: #3a3a7e;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #2a2a5e;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SecondaryButton = styled(motion(Link))`
  display: inline-block;
  background-color: transparent;
  color: #3a3a7e;
  padding: 0.8rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  border: 2px solid #3a3a7e;
  margin-left: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(58, 58, 126, 0.1);
  }
`;

// Calmi-style sections
const CalmiSection = styled.section`
  padding: 5rem 0;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 3rem;
  }
`;

const SectionHeading = styled.h2`
  font-size: 2.8rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const SectionContent = styled.div`
  flex: 1;
`;

const SectionText = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SectionImage = styled.div`
  flex: 1;
  position: relative;
  background: linear-gradient(to right, #f8f8f8, #ffffff);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }

  img {
    max-width: 100%;
    border-radius: 12px;
  }
`;

const YellowCircle = styled.div`
  width: 150px;
  height: 150px;
  background: #ffd700;
  border-radius: 50%;
`;

const GoodStuffSection = styled.section`
  text-align: center;
  padding: 5rem 0;
  position: relative;
`;

const GoodStuffTitle = styled.h2`
  font-size: 3rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const FeaturesSection = styled.section`
  padding: 5rem 0;
  background-color: #f8f9fa;
  position: relative;
  z-index: 1;
  border-radius: 20px;
  margin-top: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.2rem;
  color: #303064;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FeatureCard = styled(motion.div)`
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #303064;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  padding: 5rem 0;
  position: relative;
  z-index: 1;
`;

const StepsContainer = styled.div`
  margin-top: 3rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 30px;
    width: 2px;
    background: linear-gradient(to bottom, #303064, #f98e54);
    z-index: 0;

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const Step = styled(motion.div)`
  display: flex;
  margin-bottom: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-right: 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(48, 48, 100, 0.2);

  @media (max-width: 768px) {
    margin: 0 auto 1.5rem;
  }
`;

const StepContent = styled.div`
  flex: 1;
  background-color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  color: #303064;
  margin-bottom: 0.5rem;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

// FAQ Section
const FAQSection = styled.section`
  padding: 5rem 0;
  background-color: #f8f9fa;
  border-radius: 20px;
  margin: 3rem 0;
  position: relative;
  z-index: 1;
`;

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FAQQuestion = styled.h3`
  font-size: 1.2rem;
  color: #303064;
  margin-bottom: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const FAQAnswer = styled.div`
  color: #666;
  line-height: 1.6;
  margin-top: 0.5rem;
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  z-index: 1;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  position: relative;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  opacity: 0.9;
  position: relative;
`;

const WhiteCTAButton = styled(motion(Link))`
  display: inline-block;
  background-color: white;
  color: #3a3a7e;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const FloatingCircle = styled(motion.div)<{
  size: number;
  top: string;
  left: string;
  color: string;
}>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  opacity: 0.2;
  z-index: 0;
`;

const TherapyProfileImage = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    display: block;
  }
`;

const SessionBreakdownImage = styled.div`
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    display: block;
  }
`;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Particle animation component
const ParticlesBackground = () => {
  const [particles, setParticles] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const colors = ['#303064', '#f98e54', '#4a90e2', '#50e3c2'];
    const generateParticles = () => {
      const newParticles = [];
      const count = Math.min(Math.floor(window.innerWidth / 20), 40);

      for (let i = 0; i < count; i++) {
        const size = Math.random() * 15 + 5;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];

        newParticles.push(
          <Particle
            key={i}
            size={size}
            color={color}
            initial={{ x: `${x}vw`, y: `${y}vh` }}
            animate={{
              x: [
                `${x}vw`,
                `${x + (Math.random() * 10 - 5)}vw`,
                `${x - (Math.random() * 10 - 5)}vw`,
                `${x}vw`,
              ],
              y: [
                `${y}vh`,
                `${y - (Math.random() * 10 - 5)}vh`,
                `${y + (Math.random() * 10 - 5)}vh`,
                `${y}vh`,
              ],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              ease: 'linear',
              repeat: Infinity,
            }}
          />
        );
      }

      setParticles(newParticles);
    };

    generateParticles();

    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  return (
    <BackgroundParticles>
      {particles}
      <GradientOverlay />
    </BackgroundParticles>
  );
};

// FAQ Component
const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const faqItems = [
    {
      question: 'What is TherHappy?',
      answer:
        "TherHappy is an AI companion for mental wellness that provides empathetic conversations, emotional support, and helpful insights whenever you need it. It's designed to be available 24/7 to offer a safe space for expressing your thoughts and feelings.",
    },
    {
      question: 'Is TherHappy a replacement for professional therapy?',
      answer:
        "No, TherHappy is not a replacement for professional mental health services. While it can provide support and a listening ear, it should be used as a complementary tool. If you're experiencing serious mental health issues, please consult with a licensed professional.",
    },
    {
      question: 'How does TherHappy keep my data private?',
      answer:
        'TherHappy takes your privacy seriously. All conversations are encrypted end-to-end, and your personal data is never shared with third parties. You have complete control over your data and can delete it at any time.',
    },
    {
      question: 'Can I use TherHappy on multiple devices?',
      answer:
        'Yes! TherHappy is available on web browsers and mobile devices. Your conversation history and preferences will sync across all your devices, allowing you to continue conversations seamlessly.',
    },
    {
      question: 'How does TherHappy learn about me?',
      answer:
        'TherHappy learns from your conversations to provide more personalized support over time. It remembers important details you share and adapts to your communication style to make interactions more natural and helpful.',
    },
  ];

  const toggleItem = (index: number) => {
    if (openItem === index) {
      setOpenItem(null);
    } else {
      setOpenItem(index);
    }
  };

  return (
    <FAQSection>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      <FAQContainer>
        {faqItems.map((item, index) => (
          <FAQItem key={index}>
            <FAQQuestion onClick={() => toggleItem(index)}>
              {item.question}
              {openItem === index ? '−' : '+'}
            </FAQQuestion>
            {openItem === index && <FAQAnswer>{item.answer}</FAQAnswer>}
          </FAQItem>
        ))}
      </FAQContainer>
    </FAQSection>
  );
};

// Landing page component
const Landing: React.FC = () => {
  return (
    <>
      <ParticlesBackground />
      <LandingContainer>
        {/* Hero Section */}
        <HeroSection>
          <FloatingCircle
            size={300}
            top='-50px'
            left='-150px'
            color='#303064'
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <FloatingCircle
            size={200}
            top='30%'
            left='70%'
            color='#f98e54'
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <HeroContent>
            <HeroTitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}>
              Your AI Companion for Mental Wellness
            </HeroTitle>
            <HeroSubtitle
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}>
              Experience supportive conversations with our TherHappy assistant.
              A safe space to talk about your feelings anytime, anywhere.
            </HeroSubtitle>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}>
              <CTAButton
                to='/app'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                Try for Free
              </CTAButton>
              <SecondaryButton
                to='/pricing'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                See Pricing
              </SecondaryButton>
            </motion.div>
          </HeroContent>
          <HeroAnimationContainer>
            <BrainAnimation />
          </HeroAnimationContainer>
        </HeroSection>

        {/* All The Good Stuff Section */}
        <GoodStuffSection>
          <GoodStuffTitle>all the good stuff</GoodStuffTitle>
          <FeaturesGrid>
            <FeatureCard
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}>
              <FeatureIcon>🎙️</FeatureIcon>
              <FeatureTitle>Voice Conversations</FeatureTitle>
              <FeatureDescription>
                Speak naturally with our AI and get supportive responses in
                real-time.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <FeatureIcon>🧠</FeatureIcon>
              <FeatureTitle>Emotion Recognition</FeatureTitle>
              <FeatureDescription>
                AI that adapts to your emotional state and provides personalized
                support.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6, delay: 0.4 }}>
              <FeatureIcon>🔒</FeatureIcon>
              <FeatureTitle>Complete Privacy</FeatureTitle>
              <FeatureDescription>
                Your conversations stay private and secure with advanced
                encryption.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </GoodStuffSection>

        {/* Whenever, Wherever Section */}
        <CalmiSection>
          <SectionContent>
            <SectionHeading>whenever, wherever</SectionHeading>
            <SectionText>
              Never need a friend at 3 a.m. again. Just start chatting with
              TherHappy, your conversational AI for wellbeing that's ready 24/7.
            </SectionText>
            <CTAButton
              to='/app'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Start Chatting
            </CTAButton>
          </SectionContent>
          <SectionImage>
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}>
              <YellowCircle />
            </motion.div>
          </SectionImage>
        </CalmiSection>

        {/* Safe & Sound Section */}
        <CalmiSection>
          <SectionImage>
            <TherapyProfileImage>
              <motion.img
                src='https://images.unsplash.com/photo-1575367439058-6096bb9cf5e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
                alt='Privacy and security'
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </TherapyProfileImage>
          </SectionImage>
          <SectionContent>
            <SectionHeading>safe & sound</SectionHeading>
            <SectionText>
              Spill all the tea — TherHappy's got you. Your sessions are secure
              and confidential. We use end-to-end encryption and never share
              your data with third parties.
            </SectionText>
            <SecondaryButton
              to='/pricing'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Learn More
            </SecondaryButton>
          </SectionContent>
        </CalmiSection>

        {/* Remembers Everything Section */}
        <CalmiSection>
          <SectionContent>
            <SectionHeading>remembers everything</SectionHeading>
            <SectionText>
              TherHappy keeps your whole story in mind. It learns from every
              conversation, getting to know you better and providing more
              personalized support over time.
            </SectionText>
            <CTAButton
              to='/app'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Try It Now
            </CTAButton>
          </SectionContent>
          <SectionImage>
            <motion.img
              src='https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
              alt='Conversation history'
              initial={{ y: -5 }}
              animate={{ y: 5 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </SectionImage>
        </CalmiSection>

        {/* Therapy Profile Section */}
        <CalmiSection>
          <SectionImage>
            <TherapyProfileImage>
              <motion.img
                src='https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
                alt='Therapy profile'
                initial={{ rotate: -2 }}
                animate={{ rotate: 2 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </TherapyProfileImage>
          </SectionImage>
          <SectionContent>
            <SectionHeading>therapy profile</SectionHeading>
            <SectionText>
              Your mental health, mapped out. See insights, recognize patterns,
              and understand yourself better over time with TherHappy's detailed
              progress tracking and analysis.
            </SectionText>
            <SecondaryButton
              to='/pricing'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              See Plans
            </SecondaryButton>
          </SectionContent>
        </CalmiSection>

        {/* Session Breakdowns Section */}
        <CalmiSection>
          <SectionContent>
            <SectionHeading>session breakdowns</SectionHeading>
            <SectionText>
              Support doesn't end when your chat does. Get clear session
              breakdowns, personalized tips, and homework that sticks to help
              you progress between conversations.
            </SectionText>
            <CTAButton
              to='/app'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Start a Session
            </CTAButton>
          </SectionContent>
          <SectionImage>
            <SessionBreakdownImage>
              <motion.img
                src='https://images.unsplash.com/photo-1605647540924-852290f6b0d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
                alt='Session breakdown'
                initial={{ scale: 0.95 }}
                animate={{ scale: 1.05 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </SessionBreakdownImage>
          </SectionImage>
        </CalmiSection>

        {/* How It Works Section */}
        <HowItWorksSection>
          <SectionTitle>How It Works</SectionTitle>
          <StepsContainer>
            <Step
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}>
              <StepNumber>1</StepNumber>
              <StepContent>
                <StepTitle>Start a Conversation</StepTitle>
                <StepDescription>
                  Press the record button and start speaking about whatever's on
                  your mind. Our TherHappy assistant is ready to listen 24/7.
                </StepDescription>
              </StepContent>
            </Step>

            <Step
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}>
              <StepNumber>2</StepNumber>
              <StepContent>
                <StepTitle>AI Understands & Responds</StepTitle>
                <StepDescription>
                  Our advanced AI processes your words, detects emotions, and
                  generates a thoughtful, supportive response tailored to your
                  needs.
                </StepDescription>
              </StepContent>
            </Step>

            <Step
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              transition={{ duration: 0.6 }}>
              <StepNumber>3</StepNumber>
              <StepContent>
                <StepTitle>Continue Your Wellness Journey</StepTitle>
                <StepDescription>
                  Return anytime for support. The more you use TherHappy, the
                  better it understands your unique needs and communication
                  style.
                </StepDescription>
              </StepContent>
            </Step>
          </StepsContainer>
        </HowItWorksSection>

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <CTASection>
          <FloatingCircle
            size={240}
            top='-40px'
            left='-120px'
            color='#ffffff'
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <FloatingCircle
            size={180}
            top='60%'
            left='80%'
            color='#ffffff'
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <CTATitle>Ready to Start Your Journey?</CTATitle>
          <CTADescription>
            Experience the support of TherHappy today. It's free to try and
            available whenever you need it.
          </CTADescription>
          <WhiteCTAButton
            to='/app'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            Try Now — It's Free
          </WhiteCTAButton>
        </CTASection>
      </LandingContainer>
    </>
  );
};

export default Landing;
