import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const FeaturesContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 3rem 0;
  background: linear-gradient(135deg, rgba(249, 142, 84, 0.05), rgba(243, 184, 90, 0.05));
  border-radius: 20px;
  margin-bottom: 4rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin: 4rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FeatureCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #303064, #f98e54);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, rgba(249, 142, 84, 0.1), rgba(243, 184, 90, 0.1));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.8rem;
  color: #303064;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.8;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const FeatureBenefits = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    color: #555;
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    
    &::before {
      content: '✓';
      color: #4caf50;
      font-weight: bold;
      margin-right: 0.75rem;
      font-size: 1.2rem;
    }
  }
`;

const DetailedSection = styled.section`
  padding: 5rem 0;
  background: #f8f9fa;
  border-radius: 20px;
  margin: 4rem 0;
`;

const DetailedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
`;

const DetailContent = styled.div``;

const DetailTitle = styled.h2`
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DetailText = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const DetailImage = styled.div`
  background: linear-gradient(135deg, rgba(249, 142, 84, 0.1), rgba(243, 184, 90, 0.1));
  border-radius: 20px;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), transparent, rgba(255, 255, 255, 0.1));
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

const ImagePlaceholder = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #303064, #f98e54);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
  position: relative;
  z-index: 1;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 20px;
  margin: 4rem 0;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: white;
  color: #303064;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Features: React.FC = () => {
  return (
    <FeaturesContainer>
      <HeroSection>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <PageTitle>Powerful Features for Your Mental Wellness</PageTitle>
          <Subtitle>
            Discover how TherHappy's advanced AI technology and thoughtful design 
            create a supportive environment for your mental health journey.
          </Subtitle>
        </motion.div>
      </HeroSection>

      <FeaturesGrid>
        <FeatureCard
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <FeatureIcon>🎙️</FeatureIcon>
          <FeatureTitle>Natural Voice Conversations</FeatureTitle>
          <FeatureDescription>
            Speak naturally and get real-time responses. Our advanced speech recognition 
            understands emotions and context, making conversations feel truly human.
          </FeatureDescription>
          <FeatureBenefits>
            <li>Real-time speech recognition</li>
            <li>Emotion detection from voice</li>
            <li>Natural conversation flow</li>
            <li>Multiple language support</li>
          </FeatureBenefits>
        </FeatureCard>

        <FeatureCard
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <FeatureIcon>🧠</FeatureIcon>
          <FeatureTitle>Advanced Emotion Recognition</FeatureTitle>
          <FeatureDescription>
            Our AI analyzes your emotional state through voice tone, word choice, 
            and conversation patterns to provide personalized, empathetic support.
          </FeatureDescription>
          <FeatureBenefits>
            <li>Real-time sentiment analysis</li>
            <li>Emotional pattern recognition</li>
            <li>Personalized response adaptation</li>
            <li>Mood tracking over time</li>
          </FeatureBenefits>
        </FeatureCard>

        <FeatureCard
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FeatureIcon>🔒</FeatureIcon>
          <FeatureTitle>Complete Privacy & Security</FeatureTitle>
          <FeatureDescription>
            Your conversations are protected with end-to-end encryption. We never 
            store or share your personal information with third parties.
          </FeatureDescription>
          <FeatureBenefits>
            <li>End-to-end encryption</li>
            <li>No data sharing</li>
            <li>HIPAA-compliant storage</li>
            <li>User-controlled data deletion</li>
          </FeatureBenefits>
        </FeatureCard>

        <FeatureCard
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <FeatureIcon>📱</FeatureIcon>
          <FeatureTitle>24/7 Accessibility</FeatureTitle>
          <FeatureDescription>
            Access support whenever you need it, from any device. Our responsive 
            design ensures a seamless experience across web and mobile platforms.
          </FeatureDescription>
          <FeatureBenefits>
            <li>Cross-platform compatibility</li>
            <li>Offline conversation storage</li>
            <li>Instant availability</li>
            <li>Responsive design</li>
          </FeatureBenefits>
        </FeatureCard>

        <FeatureCard
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FeatureIcon>📊</FeatureIcon>
          <FeatureTitle>Progress Tracking</FeatureTitle>
          <FeatureDescription>
            Monitor your emotional wellness journey with detailed insights, 
            mood patterns, and progress reports to help you understand yourself better.
          </FeatureDescription>
          <FeatureBenefits>
            <li>Mood pattern analysis</li>
            <li>Weekly progress reports</li>
            <li>Goal setting and tracking</li>
            <li>Conversation insights</li>
          </FeatureBenefits>
        </FeatureCard>

        <FeatureCard
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <FeatureIcon>🎯</FeatureIcon>
          <FeatureTitle>Personalized Support</FeatureTitle>
          <FeatureDescription>
            The more you chat, the better TherHappy understands your unique needs, 
            communication style, and preferences for truly personalized care.
          </FeatureDescription>
          <FeatureBenefits>
            <li>Adaptive AI learning</li>
            <li>Customized conversation style</li>
            <li>Personal preference memory</li>
            <li>Tailored coping strategies</li>
          </FeatureBenefits>
        </FeatureCard>
      </FeaturesGrid>

      <DetailedSection>
        <DetailedGrid>
          <DetailContent>
            <DetailTitle>Evidence-Based Approach</DetailTitle>
            <DetailText>
              TherHappy is built on proven therapeutic techniques including Cognitive 
              Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and 
              Acceptance and Commitment Therapy (ACT). Our AI is trained to provide 
              responses that align with these evidence-based practices.
            </DetailText>
            <DetailText>
              While not a replacement for professional therapy, TherHappy serves as 
              a valuable complement to traditional mental health care, offering 
              immediate support when you need it most.
            </DetailText>
          </DetailContent>
          <DetailImage>
            <ImagePlaceholder>🎓</ImagePlaceholder>
          </DetailImage>
        </DetailedGrid>
      </DetailedSection>

      <DetailedSection>
        <DetailedGrid>
          <DetailImage>
            <ImagePlaceholder>🚨</ImagePlaceholder>
          </DetailImage>
          <DetailContent>
            <DetailTitle>Crisis Support & Safety</DetailTitle>
            <DetailText>
              TherHappy includes built-in crisis detection that can identify when 
              you might be in distress and need immediate professional help. We provide 
              instant access to crisis hotlines and emergency resources.
            </DetailText>
            <DetailText>
              Our safety-first approach ensures you always have access to appropriate 
              resources, whether you need immediate crisis support or longer-term 
              professional care referrals.
            </DetailText>
          </DetailContent>
        </DetailedGrid>
      </DetailedSection>

      <CTASection>
        <CTATitle>Experience TherHappy Today</CTATitle>
        <CTADescription>
          Start your mental wellness journey with all these powerful features. 
          It's free to try and available whenever you need support.
        </CTADescription>
        <CTAButton to="/app">Start Chatting Now</CTAButton>
      </CTASection>
    </FeaturesContainer>
  );
};

export default Features;