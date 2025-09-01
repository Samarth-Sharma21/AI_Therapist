import React, { useState } from 'react';
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: white;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  height: fit-content;
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: white;
`;

const InfoItem = styled.div`
  margin-bottom: 25px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
`;

const InfoIcon = styled.div`
  font-size: 1.5rem;
  margin-top: 2px;
`;

const InfoContent = styled.div`
  color: white;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const InfoText = styled.div`
  opacity: 0.9;
  line-height: 1.5;
`;

const SuccessMessage = styled(motion.div)`
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <Container>
      <Content>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Get In Touch</Title>
          <Subtitle>
            We'd love to hear from you. Whether you have questions about our AI therapy platform, 
            need support, or want to share feedback, we're here to help.
          </Subtitle>
        </Header>

        <ContactGrid>
          <ContactForm
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
          >
            <FormTitle>Send us a message</FormTitle>
            
            {showSuccess && (
              <SuccessMessage
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Thank you for your message! We'll get back to you within 24 hours.
              </SuccessMessage>
            )}

            <FormGroup>
              <Label htmlFor="name">Your Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>

          <ContactInfo
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <InfoTitle>Contact Information</InfoTitle>
            
            <InfoItem>
              <InfoIcon>📧</InfoIcon>
              <InfoContent>
                <InfoLabel>Email Support</InfoLabel>
                <InfoText>support@aitherapist.com</InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>🕒</InfoIcon>
              <InfoContent>
                <InfoLabel>Response Time</InfoLabel>
                <InfoText>Within 24 hours</InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
            <InfoIcon>💬</InfoIcon>
              <InfoContent>
                <InfoLabel>Live Chat</InfoLabel>
                <InfoText>Available Monday-Friday, 9AM-6PM EST</InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>📍</InfoIcon>
              <InfoContent>
                <InfoLabel>Office Location</InfoLabel>
                <InfoText>San Francisco, CA<br />Remote-first company</InfoText>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>🆘</InfoIcon>
              <InfoContent>
                <InfoLabel>Emergency Support</InfoLabel>
                <InfoText>
                  If you're in crisis, please contact:<br />
                  National Suicide Prevention Lifeline: 988<br />
                  Crisis Text Line: Text HOME to 741741
                </InfoText>
              </InfoContent>
            </InfoItem>
          </ContactInfo>
        </ContactGrid>
      </Content>
    </Container>
  );
};

export default Contact;