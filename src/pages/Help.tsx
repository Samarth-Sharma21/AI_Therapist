import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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

const SearchSection = styled(motion.div)`
  margin-bottom: 50px;
  text-align: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 15px 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.6);
  }
`;

const FAQSection = styled.div`
  margin-bottom: 60px;
`;

const FAQCategory = styled(motion.div)`
  margin-bottom: 40px;
`;

const CategoryTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: white;
  text-align: center;
`;

const FAQItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  margin-bottom: 15px;
  overflow: hidden;
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 25px;
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const FAQAnswer = styled(motion.div)`
  padding: 0 25px 25px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  font-size: 1rem;
`;

const ContactSection = styled(motion.div)`
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 50px;
  margin-top: 60px;
`;

const ContactTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 20px;
  color: white;
`;

const ContactText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ContactButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  }
`;

const QuickLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const QuickLinkCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const QuickLinkIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
`;

const QuickLinkTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: white;
`;

const QuickLinkDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.5;
`;

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const faqData = [
    {
      id: 'getting-started',
      category: 'Getting Started',
      questions: [
        {
          id: 'q1',
          question: 'How do I create my first chat session?',
          answer: 'Creating your first chat session is simple! After signing up and logging in, click the "New Chat" button in the sidebar. This will create a new session where you can start talking to our AI therapist immediately. Each session is automatically saved and can be accessed later from your chat history.'
        },
        {
          id: 'q2',
          question: 'Is my conversation private and secure?',
          answer: 'Yes, absolutely. All your conversations are encrypted and stored securely. We use industry-standard encryption protocols and never share your personal information or conversation content with third parties. Your privacy is our top priority.'
        },
        {
          id: 'q3',
          question: 'Can I delete my chat history?',
          answer: 'Yes, you can delete individual chat sessions by clicking the delete icon next to each session in your sidebar. You can also delete your entire account and all associated data from your account settings.'
        }
      ]
    },
    {
      id: 'features',
      category: 'Features & Usage',
      questions: [
        {
          id: 'q4',
          question: 'What therapeutic approaches does the AI use?',
          answer: 'Our AI therapist is trained on evidence-based therapeutic approaches including Cognitive Behavioral Therapy (CBT), mindfulness techniques, and supportive counseling. The AI adapts its responses based on your needs and preferences, providing personalized support.'
        },
        {
          id: 'q5',
          question: 'Can I use the AI therapist for crisis situations?',
          answer: 'While our AI therapist provides valuable support, it is not a replacement for crisis services. If you\'re experiencing a mental health crisis, please contact the National Suicide Prevention Lifeline at 988 or text HOME to 741741 for the Crisis Text Line. These services provide 24/7 support from trained professionals.'
        },
        {
          id: 'q6',
          question: 'How does the AI remember context across sessions?',
          answer: 'The AI maintains context within each individual chat session. For privacy reasons, it doesn\'t retain personal information across different sessions unless you explicitly share it. Each new session starts fresh, ensuring your privacy while still providing helpful, contextual responses within that session.'
        }
      ]
    },
    {
      id: 'technical',
      category: 'Technical Support',
      questions: [
        {
          id: 'q7',
          question: 'Why isn\'t my chat loading after refresh?',
          answer: 'If your chat history isn\'t loading, try refreshing the page or logging out and back in. Ensure you have a stable internet connection. If the issue persists, clear your browser cache and cookies, or try using a different browser. Contact our support team if you continue experiencing issues.'
        },
        {
          id: 'q8',
          question: 'Is the platform available on mobile devices?',
          answer: 'Yes! Our platform is fully responsive and works seamlessly on all devices including smartphones and tablets. You can access it through any web browser on your mobile device. We recommend using Chrome, Safari, or Firefox for the best experience.'
        },
        {
          id: 'q9',
          question: 'How do I report bugs or technical issues?',
          answer: 'You can report bugs or technical issues by clicking the "Contact Support" button below, or by emailing us at support@aitherapist.com. Please include details about the issue you\'re experiencing, your device/browser information, and screenshots if possible.'
        }
      ]
    }
  ];

  const quickLinks = [
    {
      icon: "📖",
      title: "Getting Started Guide",
      description: "Step-by-step guide to using our platform",
      action: () => window.open('/help/getting-started', '_blank')
    },
    {
      icon: "🔒",
      title: "Privacy & Security",
      description: "Learn how we protect your data",
      action: () => window.open('/privacy', '_blank')
    },
    {
      icon: "📞",
      title: "24/7 Support",
      description: "Get help whenever you need it",
      action: () => window.open('/contact', '_blank')
    },
    {
      icon: "🎯",
      title: "Feature Requests",
      description: "Suggest new features and improvements",
      action: () => window.open('/contact', '_blank')
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Container>
      <Content>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Help & Support</Title>
          <Subtitle>
            Find answers to common questions, troubleshooting guides, and ways to get additional support 
            for using our AI therapy platform.
          </Subtitle>
        </Header>

        <SearchSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SearchInput
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchSection>

        <FAQSection>
          {filteredFAQ.map((category, categoryIndex) => (
            <FAQCategory
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + categoryIndex * 0.1 }}
            >
              <CategoryTitle>{category.category}</CategoryTitle>
              {category.questions.map((faq, index) => (
                <FAQItem key={faq.id}>
                  <FAQQuestion onClick={() => toggleFAQ(faq.id)}>
                    {faq.question}
                    <span>{openFAQ === faq.id ? '−' : '+'}</span>
                  </FAQQuestion>
                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <FAQAnswer
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.answer}
                      </FAQAnswer>
                    )}
                  </AnimatePresence>
                </FAQItem>
              ))}
            </FAQCategory>
          ))}
        </FAQSection>

        <QuickLinks>
          {quickLinks.map((link, index) => (
            <QuickLinkCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              onClick={link.action}
            >
              <QuickLinkIcon>{link.icon}</QuickLinkIcon>
              <QuickLinkTitle>{link.title}</QuickLinkTitle>
              <QuickLinkDescription>{link.description}</QuickLinkDescription>
            </QuickLinkCard>
          ))}
        </QuickLinks>

        <ContactSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <ContactTitle>Need More Help?</ContactTitle>
          <ContactText>
            Can't find what you're looking for? Our support team is here to help. 
            Reach out to us anytime and we'll get back to you within 24 hours.
          </ContactText>
          <ContactButton onClick={() => window.location.href = '/contact'}>
            Contact Support
          </ContactButton>
        </ContactSection>
      </Content>
    </Container>
  );
};

export default Help;