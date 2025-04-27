import axios from 'axios';
import { constructTherapeuticResponse } from '../utils/therapyKnowledgeBase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
// Free Hugging Face API endpoint
const HF_API_URL =
  'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';

export interface SentimentResponse {
  neg: number;
  neu: number;
  pos: number;
  compound: number;
}

export interface TherapistResponse {
  response: string;
  crisis_mode: boolean;
}

/**
 * Send audio to the server for transcription
 */
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');

    const response = await axios.post(`${API_URL}/transcribe`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};

/**
 * Analyze the sentiment of the text
 */
export const analyzeSentiment = async (
  text: string
): Promise<SentimentResponse> => {
  try {
    const formData = new FormData();
    formData.append('text', text);

    const response = await fetch(`${API_URL}/analyze-sentiment/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Sentiment analysis failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};

/**
 * Generate AI therapist response using our therapy knowledge base
 */
export const generateResponse = async (
  text: string,
  sentiment?: {
    anger: number;
    fear: number;
    joy: number;
    love: number;
    sadness: number;
    surprise: number;
  },
  conversationHistory?: { user?: string; ai?: string }[]
): Promise<string> => {
  try {
    // Format conversation history for the API
    const formattedHistory = conversationHistory
      ?.map((item) => ({
        role: item.user ? 'user' : 'assistant',
        content: item.user || item.ai || '',
      }))
      .filter((item) => item.content);

    // Create FormData to send to the API
    const formData = new FormData();
    formData.append('text', text);

    if (sentiment) {
      formData.append('sentiment', JSON.stringify(sentiment));
    }

    if (formattedHistory && formattedHistory.length > 0) {
      formData.append('conversation_history', JSON.stringify(formattedHistory));
    }

    // Send the request to the backend
    const response = await axios.post(
      `${API_URL}/generate-response/`,
      formData
    );

    // Check for crisis mode or other special response flags
    if (response.data.crisis_mode) {
      // Handle crisis mode - this could trigger special UI elements
      console.warn('Crisis mode detected in user input');
      return response.data.response;
    }

    return response.data.response;
  } catch (error) {
    console.error('Error generating response from API:', error);

    // Fall back to local response generation
    console.log('Falling back to local response generation');
    const localResponse = generateLocalResponse(text, conversationHistory);
    return localResponse;
  }
};

// Helper function to generate a response locally if the API fails
const generateLocalResponse = (
  text: string,
  conversationHistory?: { user?: string; ai?: string }[]
): string => {
  // ... existing code ...
};

/**
 * Get therapy insights based on conversation history
 */
export const getTherapyInsights = async (
  conversationHistory: string[]
): Promise<{ insights: any }> => {
  try {
    const response = await axios.post(`${API_URL}/insights`, {
      conversation_history: conversationHistory,
    });

    return { insights: response.data.insights };
  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      insights: {
        mood: 'neutral',
        topics: [],
        recommendations: [
          'Consider sharing more about your feelings and experiences.',
        ],
      },
    };
  }
};

export default {
  transcribeAudio,
  generateResponse,
  getTherapyInsights,
};
