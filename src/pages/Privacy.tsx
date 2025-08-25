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

const Privacy: React.FC = () => {
  const privacySections = [
    {
      title: "Information We Collect",
      content: (
        <>
          <p>We collect information you provide directly to us, such as when you create an account, use our AI therapy services, or contact us for support.</p>
          <p><strong>Account Information:</strong> When you create an account, we collect your email address, username, and any profile information you choose to provide.</p>
          <p><strong>Therapy Conversations:</strong> We store your chat conversations with our AI therapist to provide continuous support and improve our services. These conversations are encrypted and never shared with third parties.</p>
          <p><strong>Usage Data:</strong> We collect information about how you interact with our platform, including session duration, features used, and technical information like device type and browser.</p>
          <p><strong>Payment Information:</strong> If you purchase premium features, we process payments through secure third-party payment processors. We do not store your payment card details.</p>
        </>
      )
    },
    {
      title: "How We Use Your Information",
      content: (
        <>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and maintain our AI therapy services</li>
            <li>Personalize your therapy experience</li>
            <li>Improve and develop new features</li>
            <li>Communicate with you about updates and support</li>
            <li>Ensure security and prevent abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We never use your therapy conversations for advertising or marketing purposes.</p>
        </>
      )
    },
    {
      title: "Data Security",
      content: (
        <>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul>
            <li><strong>Encryption:</strong> All data is encrypted in transit using HTTPS/TLS and at rest using AES-256 encryption.</li>
            <li><strong>Access Controls:</strong> Only authorized personnel can access user data, and access is logged and monitored.</li>
            <li><strong>Regular Audits:</strong> We conduct regular security assessments and penetration testing.</li>
            <li><strong>Data Minimization:</strong> We only collect data necessary for providing our services.</li>
            <li><strong>Secure Infrastructure:</strong> Our services are hosted on secure, HIPAA-compliant cloud infrastructure.</li>
          </ul>
        </>
      )
    },
    {
      title: "Data Retention",
      content: (
        <>
          <p>We retain your information for as long as necessary to provide our services and fulfill the purposes described in this policy:</p>
          <ul>
            <li><strong>Account Information:</strong> Retained until you delete your account or as required by law.</li>
            <li><strong>Therapy Conversations:</strong> Retained while your account is active, unless you specifically request deletion.</li>
            <li><strong>Usage Data:</strong> Retained for 12 months to improve our services, then anonymized.</li>
            <li><strong>Payment Records:</strong> Retained for 7 years for tax and accounting purposes.</li>
          </ul>
        </>
      )
    },
    {
      title: "Your Rights and Choices",
      content: (
        <>
          <p>You have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
            <li><strong>Correction:</strong> Update or correct your personal information.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements).</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service.</li>
            <li><strong>Opt-out:</strong> Opt-out of certain data uses, such as marketing communications.</li>
          </ul>
          <p>To exercise these rights, contact us at privacy@aitherapist.com or through your account settings.</p>
        </>
      )
    },
    {
      title: "Third-Party Services",
      content: (
        <>
          <p>We use trusted third-party services to support our operations:</p>
          <ul>
            <li><strong>Cloud Infrastructure:</strong> Secure cloud hosting providers</li>
            <li><strong>Payment Processing:</strong> PCI-compliant payment processors</li>
            <li><strong>Analytics:</strong> Privacy-focused analytics tools (anonymized data only)</li>
            <li><strong>Communication:</strong> Email and customer support platforms</li>
          </ul>
          <p>All third-party services are vetted for privacy and security compliance. We never sell your data to third parties.</p>
        </>
      )
    },
    {
      title: "International Data Transfers",
      content: (
        <>
          <p>Our services are hosted in the United States. If you access our services from outside the US, your information may be transferred to and processed in the US or other countries with different data protection laws.</p>
          <p>We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses approved by relevant authorities.</p>
        </>
      )
    },
    {
      title: "Children's Privacy",
      content: (
        <>
          <p>Our services are intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately at privacy@aitherapist.com.</p>
          <p>Parents or guardians can request review and deletion of their child's information by contacting us.</p>
        </>
      )
    },
    {
      title: "Changes to This Policy",
      content: (
        <>
          <p>We may update this Privacy Policy from time to time. When we do, we will:</p>
          <ul>
            <li>Post the updated policy on this page with a new "Last Updated" date</li>
            <li>Notify you via email or in-app notification for significant changes</li>
            <li>Obtain your consent for material changes that affect your rights</li>
          </ul>
          <p>We encourage you to review this policy periodically to stay informed about how we protect your privacy.</p>
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
          <Title>Privacy Policy</Title>
          <Subtitle>
            Your privacy and data security are our top priorities. Learn how we protect 
            your personal information and maintain the highest standards of data protection.
          </Subtitle>
        </Header>

        <LastUpdated>Last Updated: December 15, 2024</LastUpdated>

        {privacySections.map((section, index) => (
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
          <ContactTitle>Questions About Privacy?</ContactTitle>
          <ContactText>
            If you have questions about this Privacy Policy or our data practices, 
            please don't hesitate to reach out.
          </ContactText>
          <ContactEmail href="mailto:privacy@aitherapist.com">
            privacy@aitherapist.com
          </ContactEmail>
        </ContactSection>
      </Content>
    </Container>
  );
};

export default Privacy;