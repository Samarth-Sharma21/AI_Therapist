import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  margin: 2rem;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  max-width: 500px;
  line-height: 1.5;
`;

const ErrorDetails = styled.details`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: left;
  font-size: 0.875rem;
  max-width: 600px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        stack: error.stack
      });
    }

    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorMessage(error: Error): string {
    if (error.message.includes('network')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    if (error.message.includes('authentication')) {
      return 'Authentication error. Please sign in again to continue.';
    }
    if (error.message.includes('permission')) {
      return 'Permission denied. You may not have access to this resource.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timeout. The server took too long to respond.';
    }
    return 'Something went wrong while loading your data. Please try refreshing the page.';
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.getErrorMessage(this.state.error!);

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          
          <div>
            <ActionButton onClick={this.handleReset}>
              Try Again
            </ActionButton>
            <ActionButton onClick={this.handleReload}>
              Reload Page
            </ActionButton>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <ErrorDetails>
              <summary>Technical Details</summary>
              <p><strong>Error:</strong> {this.state.error?.toString()}</p>
              <p><strong>Stack:</strong></p>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                {this.state.error?.stack}
              </pre>
              <p><strong>Component Stack:</strong></p>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
                {this.state.errorInfo?.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;