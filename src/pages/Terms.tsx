import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
`;

const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  color: white;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: white;
`;

const SectionContent = styled.div`
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  font-size: 1rem;
  
  p {
    margin-bottom: 15px;
  }
  
  ul {
    margin: 15px 0;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  strong {
    color: white;
    font-weight: 600;
  }
  
  h3 {
    color: white;
    font-size: 1.3rem;
    margin: 25px 0 15px 0;
  }
`;

const LastUpdated = styled.div`
  text-align: center;
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 40px;
`;

const ContactSection = styled(motion.div)`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  margin-top: 50px;
`;

const ContactTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: white;
`;

const ContactText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 20px;
`;

const ContactEmail = styled.a`
  color: #ff6b6b;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Terms: React.FC = () => {
  const termsSections = [
    {
      title: "Acceptance of Terms",
      content: (
        <>
          <p>By accessing and using the AI Therapist platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.</p>
          <p>We reserve the right to modify these Terms at any time. Changes will be posted on this page with a new "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the modified Terms.</p>
          <p>The Service is intended for users aged 13 and older. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.</p>
        </>
      )
    },
    {
      title: "Service Description",
      content: (
        <>
          <p>AI Therapist provides AI-powered mental health support and conversational therapy services designed to complement, not replace, professional mental health care.</p>
          <p><strong>Not a Medical Service:</strong> The Service is not a medical device, does not provide medical advice, diagnosis, or treatment, and is not a substitute for professional mental health care, diagnosis, or treatment.</p>
          <p><strong>Emergency Situations:</strong> If you are experiencing a mental health crisis, contact emergency services (911 in the US) or the National Suicide Prevention Lifeline at 988 immediately.</p>
          <p><strong>Professional Care:</strong> Always seek the advice of qualified mental health professionals for any questions regarding your mental health or medical conditions.</p>
        </>
      )
    },
    {
      title: "User Accounts and Responsibilities",
      content: (
        <>
          <p><strong>Account Creation:</strong> You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
          <p><strong>Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use or security breach.</p>
          <p><strong>Prohibited Conduct:</strong> You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Impersonate others or provide false information</li>
            <li>Attempt to access unauthorized areas of the Service</li>
            <li>Use automated systems or bots to access the Service</li>
            <li>Interfere with the proper working of the Service</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </>
      )
    },
    {
      title: "Intellectual Property",
      content: (
        <>
          <p><strong>Ownership:</strong> The Service and all content, features, and functionality are owned by AI Therapist and are protected by copyright, trademark, and other intellectual property laws.</p>
          <p><strong>License:</strong> We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes.</p>
          <p><strong>Restrictions:</strong> You may not reproduce, distribute, modify, create derivative works, publicly display, or commercially exploit any part of the Service without our express written permission.</p>
          <p><strong>User Content:</strong> You retain ownership of content you input into the Service. By using the Service, you grant us a license to use this content solely for providing and improving the Service.</p>
        </>
      )
    },
    {
      title: "Privacy and Data Protection",
      content: (
        <>
          <p>Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you consent to the practices described in our Privacy Policy.</p>
          <p><strong>Data Security:</strong> We implement reasonable security measures to protect your information, but cannot guarantee absolute security.</p>
          <p><strong>Third-Party Services:</strong> The Service may integrate with third-party services. Your use of these services is subject to their respective terms and privacy policies.</p>
        </>
      )
    },
    {
      title: "Payment and Subscriptions",
      content: (
        <>
          <p><strong>Pricing:</strong> Prices for premium features are displayed on our website and may change with notice. All prices are in USD unless otherwise specified.</p>
          <p><strong>Payment Processing:</strong> Payments are processed through secure third-party payment processors. We do not store your payment card information.</p>
          <p><strong>Refunds:</strong> Refunds are provided in accordance with our refund policy. Contact support@aitherapist.com for refund requests.</p>
          <p><strong>Cancellation:</strong> You may cancel subscriptions at any time through your account settings. Cancellations take effect at the end of the current billing period.</p>
        </>
      )
    },
    {
      title: "Disclaimer of Warranties",
      content: (
        <>
          <p><strong>As-Is Basis:</strong> The Service is provided "as is" and "as available" without warranties of any kind, either express or implied.</p>
          <p><strong>No Medical Claims:</strong> We make no representations or warranties about the accuracy, completeness, or effectiveness of the Service for any particular purpose.</p>
          <p><strong>Availability:</strong> We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free.</p>
          <p><strong>Third-Party Content:</strong> We are not responsible for third-party content, services, or websites linked from or integrated with the Service.</p>
        </>
      )
    },
    {
      title: "Limitation of Liability",
      content: (
        <>
          <p><strong>Limitation:</strong> To the maximum extent permitted by law, AI Therapist and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
          <p><strong>Maximum Liability:</strong> Our total liability for any claim arising from the Service shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          <p><strong>User Responsibility:</strong> You acknowledge that your use of the Service is at your own risk and that you are responsible for decisions made based on information provided by the Service.</p>
        </>
      )
    },
    {
      title: "Termination and Suspension",
      content: (
        <>
          <p><strong>Termination by User:</strong> You may terminate your account at any time by contacting support@aitherapist.com.</p>
          <p><strong>Termination by Us:</strong> We may suspend or terminate your account if you violate these Terms, engage in harmful behavior, or for any business reason with reasonable notice.</p>
          <p><strong>Effect of Termination:</strong> Upon termination, your right to use the Service ceases immediately. We may delete your account and associated data, subject to legal retention requirements.</p>
        </>
      )
    },
    {
      title: "Governing Law and Dispute Resolution",
      content: (
        <>
          <p><strong>Governing Law:</strong> These Terms are governed by the laws of the State of California, USA, without regard to conflict of law principles.</p>
          <p><strong>Dispute Resolution:</strong> Any disputes arising from these Terms or the Service shall first be attempted to be resolved through good faith negotiations. If unresolved, disputes shall be submitted to binding arbitration in San Francisco, California.</p>
          <p><strong>Class Action Waiver:</strong> You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.</p>
        </>
      )
    }
  ];

  return (
    <Container>
      <Content>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Terms of Service</Title>
          <Subtitle>
            Please read these terms carefully before using our AI therapy platform. 
            Your use of the service constitutes agreement with these terms.
          </Subtitle>
        </Header>

        <LastUpdated>Last Updated: December 15, 2024</LastUpdated>

        {termsSections.map((section, index) => (
          <Section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <SectionTitle>{section.title}</SectionTitle>
            <SectionContent>{section.content}</SectionContent>
          </Section>
        ))}

        <ContactSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <ContactTitle>Questions About These Terms?</ContactTitle>
          <ContactText>
            If you have questions about these Terms of Service, please contact us.
          </ContactText>
          <ContactEmail href="mailto:legal@aitherapist.com">
            legal@aitherapist.com
          </ContactEmail>
        </ContactSection>
      </Content>
    </Container>
  );
};

export default Terms;