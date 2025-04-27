from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import os
import tempfile
import whisper
from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import torch
import json
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Therapist API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models
@app.on_event("startup")
async def startup_event():
    global whisper_model, sentiment_analyzer, text_generator
    
    # Initialize Whisper model for STT
    logger.info("Loading Whisper model...")
    whisper_model = whisper.load_model("base")
    
    # Initialize sentiment analyzer
    logger.info("Loading sentiment analyzer...")
    sentiment_analyzer = SentimentIntensityAnalyzer()
    
    # Initialize text generation model (using smaller model for demo)
    logger.info("Loading text generator...")
    try:
        text_generator = pipeline(
            "text-generation",
            model="TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            torch_dtype=torch.float16,
            device_map="auto"
        )
    except Exception as e:
        logger.error(f"Error loading text generator: {e}")
        text_generator = None

@app.get("/")
async def root():
    return {"message": "AI Therapist API is running"}

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Transcribe audio file using Whisper
    """
    try:
        # Create a temporary file
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".wav"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            # Write the uploaded file to the temporary file
            content = await file.read()
            temp.write(content)
            temp_path = temp.name
        
        # Transcribe with Whisper
        result = whisper_model.transcribe(temp_path)
        
        # Clean up
        os.unlink(temp_path)
        
        return {"text": result["text"]}
    
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-sentiment/")
async def analyze_sentiment(text: str = Form(...)):
    """
    Analyze sentiment of text
    """
    try:
        scores = sentiment_analyzer.polarity_scores(text)
        return scores
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-response/")
async def generate_response(
    text: str = Form(...),
    sentiment: Optional[str] = Form(None),
    conversation_history: Optional[str] = Form(None)
):
    """
    Generate therapeutic response based on input text, sentiment, and conversation history
    """
    try:
        # Basic prompt engineering based on sentiment
        sentiment_data = json.loads(sentiment) if sentiment else None
        conversation_data = json.loads(conversation_history) if conversation_history else []
        
        system_prompt = """You are Tharav, a helpful and compassionate AI therapist. You can handle both therapeutic conversations and everyday topics.
        
For therapeutic topics, respond with empathy, support, and evidence-based therapeutic techniques.
For everyday casual topics, be friendly, natural, and engaging like a supportive friend.
Always maintain a conversational tone and ask relevant follow-up questions.
Keep responses concise but meaningful."""
        
        if sentiment_data:
            if sentiment_data.get("compound", 0) < -0.5:
                system_prompt += " The user seems to be feeling very negative. Offer extra comfort and support."
            elif sentiment_data.get("compound", 0) < -0.1:
                system_prompt += " The user seems to be feeling somewhat negative. Be gentle and supportive."
            elif sentiment_data.get("compound", 0) > 0.5:
                system_prompt += " The user seems to be feeling very positive. Affirm their positive feelings."
        
        # Check for crisis keywords
        crisis_keywords = ["suicide", "kill myself", "want to die", "end my life", "hurt myself"]
        if any(keyword in text.lower() for keyword in crisis_keywords):
            return {
                "response": "I'm concerned about what you're sharing. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. In the US, you can call or text 988 to reach the Suicide and Crisis Lifeline. They have trained counselors available 24/7. Your life matters, and there are people who want to help.",
                "crisis_mode": True
            }
        
        # Generate response using the model
        if text_generator:
            # Build conversation context from history
            prompt = f"{system_prompt}\n\n"
            
            # Add conversation history if available
            if conversation_data and len(conversation_data) > 0:
                for entry in conversation_data:
                    if "user" in entry:
                        prompt += f"User: {entry['user']}\n"
                    if "ai" in entry:
                        prompt += f"Tharav: {entry['ai']}\n"
            
            # Add current user message
            prompt += f"User: {text}\n\nTharav:"
            
            # Generate response with appropriate parameters for conversational flow
            response = text_generator(
                prompt, 
                max_length=300, 
                do_sample=True, 
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.2
            )
            generated_text = response[0]["generated_text"]
            
            # Extract just the assistant's response
            ai_response = generated_text.split("Tharav:")[1].strip() if "Tharav:" in generated_text else generated_text
            
            # Clean up any trailing User: prompt that might have been generated
            if "User:" in ai_response:
                ai_response = ai_response.split("User:")[0].strip()
            
            return {
                "response": ai_response,
                "crisis_mode": False
            }
        else:
            # Fallback responses if model fails to load
            if any(keyword in text.lower() for keyword in ["sad", "unhappy", "depressed", "miserable"]):
                return {
                    "response": "I'm sorry to hear you're feeling this way. Remember that emotions are temporary and it's okay to feel sad sometimes. Would you like to talk more about what's bothering you?",
                    "crisis_mode": False
                }
            elif any(keyword in text.lower() for keyword in ["anxious", "worried", "stress", "panic"]):
                return {
                    "response": "It sounds like you're experiencing some anxiety. Taking deep breaths and focusing on the present moment might help. Would you like to try a brief relaxation exercise?",
                    "crisis_mode": False
                }
            else:
                return {
                    "response": "Thank you for sharing that with me. I'm here to listen and support you. Could you tell me more about how you're feeling?",
                    "crisis_mode": False
                }
    
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 