import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PricingContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 3rem 0;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: #303064;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  margin: 3rem 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const PlanCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  border: ${(props) =>
    props.featured ? '2px solid #3a3a7e' : '1px solid #eee'};
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.featured &&
    `
    transform: scale(1.05);
    
    @media (max-width: 768px) {
      transform: scale(1);
    }
  `}
`;

const PlanBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: #3a3a7e;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: bold;
  border-bottom-left-radius: 8px;
`;

const PlanTitle = styled.h3`
  font-size: 1.5rem;
  color: #303064;
  margin-bottom: 1rem;
`;

const PlanPrice = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #303064;
  margin-bottom: 1rem;

  small {
    font-size: 1rem;
    color: #666;
    font-weight: normal;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  flex: 1;

  li {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;

    &::before {
      content: '✓';
      color: #4caf50;
      font-weight: bold;
      margin-right: 0.5rem;
    }
  }
`;

const PricingButton = styled(Link)`
  display: inline-block;
  background-color: ${(props) => (props.primary ? '#3a3a7e' : 'transparent')};
  color: ${(props) => (props.primary ? 'white' : '#3a3a7e')};
  padding: 0.8rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  border: 2px solid #3a3a7e;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.primary ? '#2a2a5e' : 'rgba(58, 58, 126, 0.1)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FAQ = styled.section`
  padding: 3rem 0;
  background-color: #f8f9f9;
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const FAQTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: #303064;
  margin-bottom: 2rem;
`;

const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  max-width: 800px;
  margin: 0 auto 1.5rem;
`;

const Question = styled.h3`
  font-size: 1.2rem;
  color: #303064;
  margin-bottom: 0.5rem;
`;

const Answer = styled.p`
  color: #666;
  line-height: 1.6;
`;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Pricing: React.FC = () => {
  return (
    <PricingContainer>
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <PageTitle>Simple, Transparent Pricing</PageTitle>
          <Subtitle>
            Choose the plan that works for you. All plans include access to our
            TherHappy assistant with differing levels of features and support.
          </Subtitle>
        </motion.div>

        <PlansContainer>
          <PlanCard
            as={motion.div}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.3 }}>
            <PlanTitle>Basic</PlanTitle>
            <PlanPrice>
              Free <small>/forever</small>
            </PlanPrice>
            <FeaturesList>
              <li>Daily conversation limit (15 minutes)</li>
              <li>Basic mental wellness support</li>
              <li>Text-based conversation history (7 days)</li>
              <li>Web access only</li>
            </FeaturesList>
            <PricingButton to='/app' primary='true'>
              Get Started
            </PricingButton>
          </PlanCard>

          <PlanCard
            featured
            as={motion.div}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.1 }}>
            <PlanBadge>Most Popular</PlanBadge>
            <PlanTitle>Premium</PlanTitle>
            <PlanPrice>
              $12.99 <small>/month</small>
            </PlanPrice>
            <FeaturesList>
              <li>Unlimited conversation time</li>
              <li>Advanced emotional analysis</li>
              <li>Full conversation history (90 days)</li>
              <li>Custom voice selection</li>
              <li>Mobile and web access</li>
              <li>Progress tracking</li>
            </FeaturesList>
            <PricingButton to='/app' primary='true'>
              Try Free for 7 Days
            </PricingButton>
          </PlanCard>

          <PlanCard
            as={motion.div}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.3, delay: 0.2 }}>
            <PlanTitle>Premium Family</PlanTitle>
            <PlanPrice>
              $19.99 <small>/month</small>
            </PlanPrice>
            <FeaturesList>
              <li>All Premium features</li>
              <li>Up to 5 user profiles</li>
              <li>Priority response time</li>
              <li>Specialized topic support</li>
              <li>Monthly progress reports</li>
              <li>Email support</li>
            </FeaturesList>
            <PricingButton to='/app'>Try Free for 14 Days</PricingButton>
          </PlanCard>
        </PlansContainer>
      </HeroSection>

      <FAQ>
        <FAQTitle>Frequently Asked Questions</FAQTitle>

        <FAQItem>
          <Question>Can I switch between plans?</Question>
          <Answer>
            Yes, you can upgrade or downgrade your plan at any time. Changes
            will take effect at the start of your next billing cycle.
          </Answer>
        </FAQItem>

        <FAQItem>
          <Question>Is there a contract or commitment?</Question>
          <Answer>
            No, all our plans are month-to-month with no long-term commitment.
            You can cancel anytime.
          </Answer>
        </FAQItem>

        <FAQItem>
          <Question>How secure is my conversation data?</Question>
          <Answer>
            We take privacy very seriously. All conversations are encrypted
            end-to-end, and we never share your data with third parties. You can
            delete your data at any time.
          </Answer>
        </FAQItem>

        <FAQItem>
          <Question>Can I get a refund if I'm not satisfied?</Question>
          <Answer>
            Yes, we offer a 30-day money-back guarantee if you're not completely
            satisfied with our Premium plans.
          </Answer>
        </FAQItem>
      </FAQ>
    </PricingContainer>
  );
};

export default Pricing;
