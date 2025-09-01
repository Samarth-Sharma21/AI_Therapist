import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const FormContainer = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 2.5rem;
    border-radius: 20px;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #303064;
  font-size: 2rem;
  background: linear-gradient(135deg, #303064, #f98e54);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #303064;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #f98e54;
    box-shadow: 0 0 0 3px rgba(249, 142, 84, 0.1);
  }
  
  &::placeholder {
    color: #a0a0a0;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #303064, #f98e54);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fdf2f2;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  font-size: 0.9rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  color: #16a085;
  background-color: #f0fdfa;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #a7f3d0;
  font-size: 0.9rem;
  text-align: center;
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  
  button {
    background: none;
    border: none;
    color: #f98e54;
    cursor: pointer;
    font-weight: 600;
    text-decoration: underline;
    
    &:hover {
      color: #303064;
    }
  }
`;

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToSignIn, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: ''
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { signUp, clearError } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (localError) {
      setLocalError(null);
      clearError();
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLocalLoading(true);
      setLocalError(null);
      
      await signUp(
        formData.email,
        formData.password,
        formData.username || undefined,
        formData.fullName || undefined
      );
      
      setSuccess(true);
      
      // Redirect after successful signup
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
      
    } catch (error: any) {
      setLocalError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  if (success) {
    return (
      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <SuccessMessage>
          🎉 Account created successfully! Redirecting to chat...
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <Title>Create Account</Title>
      
      {localError && <ErrorMessage>{localError}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Full Name (Optional)</Label>
          <Input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label>Username (Optional)</Label>
          <Input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
          />
        </InputGroup>

        <InputGroup>
          <Label>Email Address *</Label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Password *</Label>
          <Input
            type="password"
            name="password"
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>Confirm Password *</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <Button
          type="submit"
          disabled={localLoading}
          whileHover={{ scale: localLoading ? 1 : 1.02 }}
          whileTap={{ scale: localLoading ? 1 : 0.98 }}>
          {localLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>

      <SwitchText>
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToSignIn}>
          Sign In
        </button>
      </SwitchText>
    </FormContainer>
  );
};

export default SignUpForm;