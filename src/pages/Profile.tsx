import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorBoundary from '../components/ErrorBoundary';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 140px 20px 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 120px 15px 40px;
  }
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 50px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 30px;
    border-radius: 24px;
  }
`;

const Avatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #303064, #f98e54);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 3.5rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 15px 30px rgba(48, 48, 100, 0.2);
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 3rem;
    margin-bottom: 25px;
  }
`;

const UserName = styled.h1`
  font-size: 2.5rem;
  color: #303064;
  margin: 0 0 15px 0;
  font-weight: 700;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const UserEmail = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 40px 0;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 35px;
  }
`;

const Section = styled.div`
  text-align: left;
  margin-bottom: 40px;
  
  &:last-of-type {
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #303064;
  margin: 0 0 20px 0;
  font-weight: 600;
  border-bottom: 3px solid #f98e54;
  padding-bottom: 8px;
  display: inline-block;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid rgba(48, 48, 100, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 15px 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #303064;
  font-size: 1rem;
`;

const InfoValue = styled.span`
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  word-break: break-all;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(48, 48, 100, 0.2);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(48, 48, 100, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 15px 30px;
    margin: 10px;
    font-size: 1rem;
  }
`;

const DangerButton = styled(ActionButton)`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  
  &:hover {
    box-shadow: 0 12px 30px rgba(231, 76, 60, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 25px;
  margin: 30px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, rgba(48, 48, 100, 0.05), rgba(249, 142, 84, 0.05));
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(48, 48, 100, 0.1);
  backdrop-filter: blur(10px);
  
  @media (max-width: 768px) {
    padding: 25px 15px;
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #303064;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
  margin-top: 5px;
  font-weight: 500;
`;

const Profile: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userStats, setUserStats] = useState({
    totalSessions: 0,
    totalMessages: 0,
    accountCreated: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Load user stats
    loadUserStats();
  }, [user, navigate]);

  const loadUserStats = async () => {
    try {
      // In a real app, this would fetch from your backend
      const mockStats = {
        totalSessions: Math.floor(Math.random() * 50) + 10,
        totalMessages: Math.floor(Math.random() * 200) + 50,
        accountCreated: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown',
      };
      setUserStats(mockStats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <ErrorBoundary>
      <Container>
        <ProfileCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Avatar>
            {getInitials(user.email || 'U')}
          </Avatar>
          
          <UserName>{user.user_metadata?.full_name || 'User'}</UserName>
          <UserEmail>{user.email}</UserEmail>

          <Section>
            <SectionTitle>Account Statistics</SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatNumber>{userStats.totalSessions}</StatNumber>
                <StatLabel>Chat Sessions</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{userStats.totalMessages}</StatNumber>
                <StatLabel>Total Messages</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{userStats.accountCreated}</StatNumber>
                <StatLabel>Account Created</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section>
            <SectionTitle>Account Details</SectionTitle>
            <InfoItem>
              <InfoLabel>Email:</InfoLabel>
              <InfoValue>{user.email}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>User ID:</InfoLabel>
              <InfoValue>{user.id.substring(0, 8)}...</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email Verified:</InfoLabel>
              <InfoValue>{user.email_confirmed_at ? 'Yes' : 'No'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Last Sign In:</InfoLabel>
              <InfoValue>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}</InfoValue>
            </InfoItem>
          </Section>

          <div style={{ marginTop: '50px', textAlign: 'center' }}>
            <ActionButton 
              onClick={() => navigate('/app')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Chat
            </ActionButton>
            
            <DangerButton 
              onClick={handleLogout}
              disabled={isLoggingOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoggingOut ? 'Logging out...' : 'Sign Out'}
            </DangerButton>
          </div>
        </ProfileCard>
      </Container>
    </ErrorBoundary>
  );
};

export default Profile;