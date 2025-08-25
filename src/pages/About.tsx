import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.div`
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

const ContentSection = styled.section`
  padding: 4rem 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  &:nth-child(even) {
    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      
      > div:first-child {
        order: 2;
      }
      
      > div:last-child {
        order: 1;
      }
    }
  }
`;

const ContentText = styled.div``;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const ContentImage = styled.div`
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

const ValuesSection = styled.section`
  background: #f8f9fa;
  padding: 5rem 2rem;
  border-radius: 20px;
  margin: 4rem 0;
`;

const ValuesTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ValueCard = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  }
`;

const ValueIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  color: #303064;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ValueDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TeamSection = styled.section`
  padding: 4rem 0;
`;

const TeamTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TeamDescription = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.8;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  padding: 4rem 2rem;
  border-radius: 20px;
  margin: 4rem 0;
  text-align: center;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatItem = styled.div`
  padding: 1rem;
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const CTASection = styled.section`
  background: linear-gradient(135deg, rgba(249, 142, 84, 0.1), rgba(243, 184, 90, 0.1));
  padding: 4rem 2rem;
  border-radius: 20px;
  text-align: center;
  margin: 4rem 0;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(48, 48, 100, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(48, 48, 100, 0.4);
  }
`;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const About: React.FC = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <PageTitle>About TherHappy</PageTitle>
          <Subtitle>
            We're on a mission to make mental wellness support accessible to everyone, 
            everywhere, at any time they need it.
          </Subtitle>
        </motion.div>
      </HeroSection>

      <ContentSection>
        <ContentText>
          <SectionTitle>Our Mission</SectionTitle>
          <SectionDescription>
            Mental health support shouldn't be limited by time zones, appointment 
            availability, or geographic location. TherHappy was created to provide 
            immediate, compassionate support when you need it most - whether that's 
            3 AM on a Tuesday or during a difficult moment at work.
          </SectionDescription>
          <SectionDescription>
            We believe that everyone deserves access to quality mental wellness 
            support, and we're using AI technology to make that a reality.
          </SectionDescription>
        </ContentText>
        <ContentImage>
          <ImagePlaceholder>🎯</ImagePlaceholder>
        </ContentImage>
      </ContentSection>

      <ContentSection>
        <ContentText>
          <SectionTitle>How We Started</SectionTitle>
          <SectionDescription>
            TherHappy began when our founders experienced firsthand how difficult 
            it can be to find mental health support during critical moments. 
            Long waiting lists, limited availability, and high costs created 
            barriers that prevented people from getting the help they needed.
          </SectionDescription>
          <SectionDescription>
            We saw an opportunity to use advanced AI technology to create a bridge - 
            not to replace human therapists, but to provide immediate support and 
            guidance that could help people through difficult times and complement 
            traditional therapy.
          </SectionDescription>
        </ContentText>
        <ContentImage>
          <ImagePlaceholder>🌱</ImagePlaceholder>
        </ContentImage>
      </ContentSection>

      <ValuesSection>
        <ValuesTitle>Our Values</ValuesTitle>
        <ValuesGrid>
          <ValueCard
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <ValueIcon>💙</ValueIcon>
            <ValueTitle>Empathy First</ValueTitle>
            <ValueDescription>
              Every interaction is designed with genuine care and understanding. 
              We believe in meeting people where they are, without judgment.
            </ValueDescription>
          </ValueCard>

          <ValueCard
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ValueIcon>🔒</ValueIcon>
            <ValueTitle>Privacy & Safety</ValueTitle>
            <ValueDescription>
              Your mental health journey is personal. We protect your privacy 
              with the highest security standards and never share your data.
            </ValueDescription>
          </ValueCard>

          <ValueCard
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ValueIcon>📚</ValueIcon>
            <ValueTitle>Evidence-Based</ValueTitle>
            <ValueDescription>
              Our AI is trained on proven therapeutic approaches and continuously 
              updated with the latest research in mental health and psychology.
            </ValueDescription>
          </ValueCard>
        </ValuesGrid>
      </ValuesSection>

      <StatsSection>
        <SectionTitle style={{ color: 'white', marginBottom: '3rem' }}>
          Making a Difference
        </SectionTitle>
        <StatsGrid>
          <StatItem>
            <StatNumber>10,000+</StatNumber>
            <StatLabel>Conversations</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Availability</StatLabel>
          </StatItem>
          <StatItem>
            <StatNumber>50+</StatNumber>
            <StatLabel>Countries</StatLabel>
          </StatItem>
        </StatsGrid>
      </StatsSection>

      <TeamSection>
        <TeamTitle>Our Commitment</TeamTitle>
        <TeamDescription>
          TherHappy is built by a team of mental health professionals, AI researchers, 
          and engineers who are passionate about making mental wellness support 
          more accessible. We work closely with licensed therapists and counselors 
          to ensure our AI provides helpful, appropriate, and safe responses.
        </TeamDescription>
        <TeamDescription>
          While TherHappy is not a replacement for professional therapy, we're 
          proud to serve as a valuable complement to traditional mental health 
          care - providing immediate support, helping people develop coping strategies, 
          and offering a safe space to process thoughts and emotions.
        </TeamDescription>
      </TeamSection>

      <CTASection>
        <CTATitle>Ready to Start Your Journey?</CTATitle>
        <CTADescription>
          Experience the supportive, understanding conversation you deserve. 
          TherHappy is here whenever you need to talk.
        </CTADescription>
        <CTAButton to="/app">Try TherHappy Free</CTAButton>
      </CTASection>
    </AboutContainer>
  );
};

export default About;