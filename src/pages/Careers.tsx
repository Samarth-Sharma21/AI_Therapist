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

const CareersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 60px;
`;

const JobCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px;
  text-align: left;
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: white;
`;

const JobDescription = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const JobRequirements = styled.ul`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 25px;
  padding-left: 20px;
  line-height: 1.5;
`;

const ApplyButton = styled.button`
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  }
`;

const CultureSection = styled(motion.div)`
  margin-top: 80px;
  text-align: center;
`;

const CultureTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 40px;
  color: white;
`;

const CultureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-top: 40px;
`;

const CultureItem = styled.div`
  text-align: center;
`;

const CultureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const CultureText = styled.h4`
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: white;
`;

const CultureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const Careers: React.FC = () => {
  const jobOpenings = [
    {
      title: "Senior AI Engineer",
      description: "Lead the development of cutting-edge AI therapy models and conversational systems.",
      requirements: ["5+ years AI/ML experience", "Python & TensorFlow expertise", "Healthcare domain knowledge"]
    },
    {
      title: "Clinical Psychologist",
      description: "Provide clinical expertise to enhance AI therapy effectiveness and safety.",
      requirements: ["Licensed psychologist", "CBT & therapy experience", "AI/tech familiarity preferred"]
    },
    {
      title: "Product Designer",
      description: "Design intuitive, therapeutic user experiences that make mental health support accessible.",
      requirements: ["UX/UI design portfolio", "Healthcare app experience", "User research skills"]
    },
    {
      title: "Data Scientist",
      description: "Analyze therapy data to improve AI models and user outcomes.",
      requirements: ["Statistical analysis skills", "Python/R proficiency", "Healthcare data experience"]
    }
  ];

  const cultureValues = [
    { icon: "🤝", title: "Collaborative", description: "We work together to solve complex mental health challenges." },
    { icon: "🌱", title: "Growth-Oriented", description: "Continuous learning and personal development are core to our culture." },
    { icon: "💡", title: "Innovative", description: "We push boundaries to create groundbreaking therapeutic AI solutions." },
    { icon: "❤️", title: "Compassionate", description: "Empathy and care guide everything we do for our users and each other." }
  ];

  return (
    <Container>
      <Content>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Join Our Mission</Title>
          <Subtitle>
            Help us revolutionize mental health care through innovative AI technology. 
            We're building the future of accessible, effective therapy.
          </Subtitle>
        </Header>

        <CareersGrid>
          {jobOpenings.map((job, index) => (
            <JobCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <JobTitle>{job.title}</JobTitle>
              <JobDescription>{job.description}</JobDescription>
              <JobRequirements>
                {job.requirements.map((req, reqIndex) => (
                  <li key={reqIndex}>{req}</li>
                ))}
              </JobRequirements>
              <ApplyButton>Apply Now</ApplyButton>
            </JobCard>
          ))}
        </CareersGrid>

        <CultureSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CultureTitle>Our Culture</CultureTitle>
          <CultureGrid>
            {cultureValues.map((value, index) => (
              <CultureItem key={index}>
                <CultureIcon>{value.icon}</CultureIcon>
                <CultureText>{value.title}</CultureText>
                <CultureDescription>{value.description}</CultureDescription>
              </CultureItem>
            ))}
          </CultureGrid>
        </CultureSection>
      </Content>
    </Container>
  );
};

export default Careers;