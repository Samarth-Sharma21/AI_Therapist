import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorBoundary from '../components/ErrorBoundary';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #303064, #f98e54);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 3rem;
  color: white;
  font-weight: bold;
`;

const UserName = styled.h1`
  font-size: 2rem;
  color: #303064;
  margin: 0 0 10px 0;
`;

const UserEmail = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 30px 0;
`;

const Section = styled.div`
  text-align: left;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: #303064;
  margin: 0 0 15px 0;
  border-bottom: 2px solid #f98e54;
  padding-bottom: 5px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #303064;
`;

const InfoValue = styled.span`
  color: #666;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DangerButton = styled(ActionButton)`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const StatCard = styled.div`
  background: rgba(48, 48, 100, 0.05);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #303064;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
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

          <div style={{ marginTop: '40px' }}>
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