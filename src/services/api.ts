import axios from 'axios';

// Type definitions for SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'openai/gpt-oss-20b:free';

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
 * Transcribe audio using browser's Web Speech API
 */
export const transcribeAudio = async (audioBlob?: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        resolve("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      // If audioBlob is provided, use it for transcription
      if (audioBlob) {
        // For now, use a placeholder since Web Speech API requires microphone access
        // In a real implementation, you would use the audioBlob with a transcription service
        resolve("Audio transcription would process the provided audio blob here.");
        return;
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(`Speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        // Fallback if no speech detected
        resolve("No speech detected. Please try again.");
      };

      recognition.start();
    } catch (error) {
      reject(`Error accessing microphone: ${error}`);
    }
  });
};

/**
 * Simple sentiment analysis without backend dependency
 */
export const analyzeSentiment = async (
  text: string
): Promise<SentimentResponse> => {
  try {
    // Simple keyword-based sentiment analysis
    const positiveWords = ['good', 'great', 'happy', 'joy', 'love', 'excited', 'wonderful', 'amazing', 'fantastic', 'positive'];
    const negativeWords = ['bad', 'terrible', 'sad', 'angry', 'hate', 'depressed', 'awful', 'horrible', 'negative', 'upset'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const total = words.length;
    const positiveRatio = positiveCount / total;
    const negativeRatio = negativeCount / total;
    const neutralRatio = 1 - positiveRatio - negativeRatio;
    
    // Calculate compound score based on word counts
    const compound = (positiveCount - negativeCount) / Math.max(total, 1);
    
    return {
      neg: Math.max(0, negativeRatio),
      neu: Math.max(0, neutralRatio),
      pos: Math.max(0, positiveRatio),
      compound: Math.max(-1, Math.min(1, compound))
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    // Return neutral sentiment if analysis fails
    return {
      neg: 0,
      neu: 1,
      pos: 0,
      compound: 0
    };
  }
};

/**
 * Generate AI therapist response using our therapy knowledge base
 */
export const generateResponse = async (
  text: string,
  _sentiment?: {
    anger: number;
    fear: number;
    joy: number;
    love: number;
    sadness: number;
    surprise: number;
  },
  conversationHistory?: { user?: string; ai?: string }[]
): Promise<string> => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is required. Please configure your API key in .env.local file.');
  }

  try {
    // Format conversation history for OpenRouter
    const messages = [];
    
    // Enhanced therapeutic system prompt
    messages.push({
      role: 'system',
      content: `You are an expert AI therapist with deep knowledge of evidence-based therapeutic approaches including CBT, DBT, ACT, and trauma-informed care. You are also knowledgeable about general topics and can provide factual information when asked. Your responses must:

1. ALWAYS maintain a warm, empathetic, and non-judgmental therapeutic tone
2. Use active listening techniques - reflect feelings, validate experiences, and show genuine understanding
3. Provide therapeutic support and mental health guidance when users express emotional distress or mental health concerns
4. Answer factual questions directly and accurately when users ask about general knowledge topics
5. Use appropriate therapeutic techniques based on the user's needs
6. Acknowledge and validate the user's emotions before offering guidance
7. Maintain professional boundaries while being deeply compassionate
8. Include gentle follow-up questions when appropriate to encourage deeper exploration
9. Use trauma-informed language and approaches
10. Always prioritize the user's emotional safety and well-being

Your role is to provide both therapeutic support for mental health concerns and factual information for general questions. You are not a replacement for professional therapy but can offer immediate support and guidance for emotional concerns, while also being helpful with general knowledge questions.`
    });

    // Add conversation history (last 10 exchanges)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(item => {
        if (item.user) {
          messages.push({ role: 'user', content: item.user });
        }
        if (item.ai) {
          messages.push({ role: 'assistant', content: item.ai });
        }
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: text });

    // Make direct API call to OpenRouter
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: OPENROUTER_MODEL,
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Therapist',
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response from OpenRouter');
    }

    // Check for crisis keywords in the response
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'hurt myself', 'self-harm', 'suicidal'];
    const hasCrisisKeyword = crisisKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (hasCrisisKeyword) {
      console.warn('Crisis mode detected in user input');
      return `${aiResponse}

**Important**: If you're having thoughts of self-harm or suicide, please reach out for immediate help:
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741
- Emergency services: 911

You are not alone, and help is available.`;
    }

    return aiResponse;
  } catch (error) {
    console.error('Error generating response from OpenRouter:', error);
    throw new Error('Unable to generate therapeutic response. Please check your internet connection and try again.');
  }
};



export default {
  transcribeAudio,
  generateResponse,
  analyzeSentiment
};
