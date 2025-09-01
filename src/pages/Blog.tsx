import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
`;

const Content = styled.div`
  max-width: 1200px;
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

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const BlogCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

const BlogImage = styled.div`
  height: 200px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const BlogContent = styled.div`
  padding: 30px;
`;

const BlogDate = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 10px;
`;

const BlogTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
  line-height: 1.4;
`;

const BlogExcerpt = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const ReadMore = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  }
`;

const NewsletterSection = styled(motion.div)`
  margin-top: 80px;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 60px 40px;
`;

const NewsletterTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: white;
`;

const NewsletterText = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const NewsletterForm = styled.div`
  display: flex;
  gap: 15px;
  max-width: 500px;
  margin: 0 auto;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 15px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
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

const NewsletterButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
  }
`;

const Blog: React.FC = () => {
  const blogPosts = [
    {
      title: "The Future of AI-Powered Mental Health Support",
      excerpt: "Exploring how artificial intelligence is revolutionizing therapy accessibility and effectiveness for millions worldwide.",
      date: "December 15, 2024",
      emoji: "🤖"
    },
    {
      title: "5 Ways AI Therapy Complements Traditional Counseling",
      excerpt: "Discover how AI-powered therapy can work alongside traditional therapy to provide 24/7 support and enhanced outcomes.",
      date: "December 10, 2024",
      emoji: "🧠"
    },
    {
      title: "Building Trust in AI Therapy: Privacy & Security First",
      excerpt: "Learn about the rigorous privacy measures and security protocols that protect your sensitive mental health data.",
      date: "December 5, 2024",
      emoji: "🔒"
    },
    {
      title: "Real User Stories: How AI Therapy Changed Lives",
      excerpt: "Inspiring stories from users who found hope, healing, and growth through our AI therapy platform.",
      date: "November 28, 2024",
      emoji: "💚"
    },
    {
      title: "Understanding CBT Through AI: A Modern Approach",
      excerpt: "How artificial intelligence makes cognitive behavioral therapy more accessible and personalized than ever before.",
      date: "November 20, 2024",
      emoji: "🎯"
    },
    {
      title: "The Science Behind AI Emotional Intelligence",
      excerpt: "Exploring the research and technology that enables AI to understand and respond to human emotions effectively.",
      date: "November 15, 2024",
      emoji: "🔬"
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic here
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <Container>
      <Content>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Our Blog</Title>
          <Subtitle>
            Stay updated with the latest insights, research, and developments 
            in AI-powered mental health support and therapy innovation.
          </Subtitle>
        </Header>

        <BlogGrid>
          {blogPosts.map((post, index) => (
            <BlogCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <BlogImage>{post.emoji}</BlogImage>
              <BlogContent>
                <BlogDate>{post.date}</BlogDate>
                <BlogTitle>{post.title}</BlogTitle>
                <BlogExcerpt>{post.excerpt}</BlogExcerpt>
                <ReadMore>Read More →</ReadMore>
              </BlogContent>
            </BlogCard>
          ))}
        </BlogGrid>

        <NewsletterSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <NewsletterTitle>Stay Informed</NewsletterTitle>
          <NewsletterText>
            Get the latest articles and updates delivered straight to your inbox. 
            No spam, just valuable insights on mental health and AI therapy.
          </NewsletterText>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Enter your email"
              required
            />
            <NewsletterButton type="submit">
              Subscribe
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterSection>
      </Content>
    </Container>
  );
};

export default Blog;