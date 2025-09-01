import axios from "axios";

// Type definitions for SpeechRecognition API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
// Get configuration from runtime environment to prevent bundling secrets
const getOpenRouterConfig = () => {
  return {
    apiKey: (typeof window !== 'undefined' && (window as any).ENV?.VITE_OPENROUTER_API_KEY) || 
            (typeof process !== 'undefined' && process.env?.VITE_OPENROUTER_API_KEY) || 
            '',
    model: (typeof window !== 'undefined' && (window as any).ENV?.VITE_OPENROUTER_MODEL) || 
           (typeof process !== 'undefined' && process.env?.VITE_OPENROUTER_MODEL) || 
           'openai/gpt-oss-20b:free'
  };
};

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
 * Transcribe audio using browser's Web Speech API or fallback methods
 */
export const transcribeAudio = async (audioBlob?: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // If audioBlob is provided, process it properly
      if (audioBlob) {
        // Create a proper transcription flow for the audio blob
        processAudioBlob(audioBlob)
          .then(resolve)
          .catch(() => {
            // Fallback to live speech recognition if blob processing fails
            startLiveSpeechRecognition(resolve, reject);
          });
        return;
      }

      // If no blob provided, use live speech recognition
      startLiveSpeechRecognition(resolve, reject);
    } catch (error) {
      reject(`Error processing audio: ${error}`);
    }
  });
};

/**
 * Process audio blob using Web Audio API and fallback methods
 */
const processAudioBlob = async (audioBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Create a blob URL
      const audioUrl = URL.createObjectURL(audioBlob);

      // For Chrome compatibility, we need to properly handle the blob
      const audio = new Audio(audioUrl);

      // Clean up the blob URL after a short delay to prevent memory leaks
      const cleanup = () => {
        setTimeout(() => {
          URL.revokeObjectURL(audioUrl);
        }, 1000);
      };

      // Since we can't directly transcribe from blob with Web Speech API,
      // we'll implement a hybrid approach

      // Method 1: Try to use the audio blob with a fallback message
      // In a production app, you would send this to a transcription service
      audio.onloadeddata = () => {
        cleanup();
        // For now, we'll use a more user-friendly message
        // In production, this would be sent to OpenAI Whisper or similar service
        resolve(
          "I heard your voice message. Please type your message or try speaking again if the transcription didn't work."
        );
      };

      audio.onerror = () => {
        cleanup();
        // Fallback to live speech recognition
        reject(new Error("Audio blob processing failed"));
      };

      // Load the audio to trigger the event
      audio.load();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Start live speech recognition using Web Speech API
 */
const startLiveSpeechRecognition = (
  resolve: (value: string) => void,
  reject: (reason?: any) => void
) => {
  try {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      resolve(
        "Speech recognition is not supported in your browser. Please type your message instead."
      );
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    let hasResult = false;

    recognition.onresult = (event) => {
      hasResult = true;
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      // Only accept results with reasonable confidence
      if (confidence > 0.3) {
        resolve(transcript);
      } else {
        resolve(
          "I couldn't quite understand that. Could you please speak more clearly or type your message?"
        );
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      switch (event.error) {
        case "network":
          reject(
            "Network error. Please check your internet connection and try again."
          );
          break;
        case "not-allowed":
          reject(
            "Microphone access denied. Please allow microphone access and try again."
          );
          break;
        case "no-speech":
          resolve(
            "No speech detected. Please try speaking again or type your message."
          );
          break;
        case "audio-capture":
          reject(
            "Microphone not available. Please check your microphone and try again."
          );
          break;
        case "service-not-allowed":
          reject(
            "Speech recognition service is not available. Please try typing your message."
          );
          break;
        default:
          reject(
            `Speech recognition error: ${event.error}. Please try typing your message.`
          );
      }
    };

    recognition.onend = () => {
      if (!hasResult) {
        resolve("No speech detected. Please try again or type your message.");
      }
    };

    recognition.start();
  } catch (error) {
    reject(`Error starting speech recognition: ${error}`);
  }
};

/**
 * Simple sentiment analysis without backend dependency
 */
export const analyzeSentiment = async (
  text: string
): Promise<SentimentResponse> => {
  try {
    // Simple keyword-based sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "happy",
      "joy",
      "love",
      "excited",
      "wonderful",
      "amazing",
      "fantastic",
      "positive",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "sad",
      "angry",
      "hate",
      "depressed",
      "awful",
      "horrible",
      "negative",
      "upset",
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      if (positiveWords.some((pw) => word.includes(pw))) positiveCount++;
      if (negativeWords.some((nw) => word.includes(nw))) negativeCount++;
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
      compound: Math.max(-1, Math.min(1, compound)),
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // Return neutral sentiment if analysis fails
    return {
      neg: 0,
      neu: 1,
      pos: 0,
      compound: 0,
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
  const config = getOpenRouterConfig();
  if (!config.apiKey) {
    throw new Error(
      "OpenRouter API key is required. Please configure your API key in .env.local file."
    );
  }

  try {
    // Format conversation history for OpenRouter
    const messages = [];

    // Enhanced therapeutic system prompt
    messages.push({
      role: "system",
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

Your role is to provide both therapeutic support for mental health concerns and factual information for general questions. You are not a replacement for professional therapy but can offer immediate support and guidance for emotional concerns, while also being helpful with general knowledge questions.`,
    });

    // Add conversation history (last 10 exchanges)
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach((item) => {
        if (item.user) {
          messages.push({ role: "user", content: item.user });
        }
        if (item.ai) {
          messages.push({ role: "assistant", content: item.ai });
        }
      });
    }

    // Add current user message
    messages.push({ role: "user", content: text });

    // Make direct API call to OpenRouter
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: config.model,
        messages: messages,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Therapist",
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error("No response from OpenRouter");
    }

    // Check for crisis keywords in the response
    const crisisKeywords = [
      "suicide",
      "kill myself",
      "end it all",
      "hurt myself",
      "self-harm",
      "suicidal",
    ];
    const hasCrisisKeyword = crisisKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword)
    );

    if (hasCrisisKeyword) {
      console.warn("Crisis mode detected in user input");
      return `${aiResponse}

**Important**: If you're having thoughts of self-harm or suicide, please reach out for immediate help:
- National Suicide Prevention Lifeline: 988 (US)
- Crisis Text Line: Text HOME to 741741
- Emergency services: 911

You are not alone, and help is available.`;
    }

    return aiResponse;
  } catch (error: any) {
    console.error("Error generating response from OpenRouter:", error);

    if (error.response?.status === 401) {
      throw new Error(
        "Authentication failed. Please check your OpenRouter API key in the .env.local file and ensure it is valid and has sufficient credits."
      );
    } else if (error.response?.status === 402) {
      throw new Error(
        "Insufficient credits. Please add more credits to your OpenRouter account."
      );
    } else if (error.response?.status === 429) {
      throw new Error(
        "Rate limit exceeded. Please wait a moment and try again."
      );
    } else if (error.response?.status === 503) {
      throw new Error(
        "Service temporarily unavailable. Please try again in a few moments."
      );
    } else {
      throw new Error(
        "Unable to generate therapeutic response. Please check your internet connection and try again."
      );
    }
  }
};

export default {
  transcribeAudio,
  generateResponse,
  analyzeSentiment,
};
