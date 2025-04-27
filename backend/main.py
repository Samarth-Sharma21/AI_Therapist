from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydub import AudioSegment
import os
import tempfile
import whisper
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer, Conversation
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
    global whisper_model, sentiment_analyzer, tokenizer, model, text_generator
    
    # Initialize Whisper model for STT
    logger.info("Loading Whisper model...")
    whisper_model = whisper.load_model("base")
    
    # Initialize sentiment analyzer
    logger.info("Loading sentiment analyzer...")
    sentiment_analyzer = SentimentIntensityAnalyzer()
    
    # Initialize DialoGPT for better conversational abilities
    logger.info("Loading DialoGPT model...")
    try:
        # Using DialoGPT-medium for better conversation quality
        model_name = "microsoft/DialoGPT-medium"
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name)
        
        # Create a text generation pipeline
        text_generator = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            device_map="auto" if torch.cuda.is_available() else "cpu",
            max_length=1000
        )
        logger.info("DialoGPT model loaded successfully")
    except Exception as e:
        logger.error(f"Error loading DialoGPT model: {e}")
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
        # Parse sentiment and conversation history
        sentiment_data = json.loads(sentiment) if sentiment else None
        conversation_data = json.loads(conversation_history) if conversation_history else []
        
        # Enhanced system prompt with more specific therapeutic guidelines
        system_prompt = """You are Tharav, a compassionate AI therapist with expertise in cognitive behavioral therapy, mindfulness, and supportive counseling.

When responding to users:
1) First acknowledge their feelings and experiences
2) Use reflective listening techniques to show understanding
3) Ask thoughtful open-ended questions to explore their situation deeper
4) Offer one practical technique or insight that might help
5) Maintain a warm, empathetic tone without being overly clinical

Remember that you can discuss both therapeutic topics and everyday subjects with equal empathy and engagement. Be conversational but insightful."""
        
        # Adapt prompt based on sentiment
        if sentiment_data:
            if sentiment_data.get("compound", 0) < -0.5:
                system_prompt += " The user appears to be experiencing significant distress. Respond with extra warmth and support, while gently offering resources or coping strategies."
            elif sentiment_data.get("compound", 0) < -0.1:
                system_prompt += " The user seems to be feeling somewhat negative. Show empathy while offering gentle encouragement."
            elif sentiment_data.get("compound", 0) > 0.5:
                system_prompt += " The user seems to be in a positive state. Reinforce this positivity while remaining authentic and engaged."
        
        # Check for crisis keywords (safety feature)
        crisis_keywords = ["suicide", "kill myself", "want to die", "end my life", "hurt myself"]
        if any(keyword in text.lower() for keyword in crisis_keywords):
            return {
                "response": "I'm concerned about what you're sharing. If you're having thoughts of harming yourself, please reach out to a crisis helpline immediately. In the US, you can call or text 988 to reach the Suicide and Crisis Lifeline. They have trained counselors available 24/7. Your life matters, and there are people who want to help.",
                "crisis_mode": True
            }
        
        # Generate response using the model
        if text_generator:
            # Build the conversation prompt with detailed history
            full_prompt = f"{system_prompt}\n\n"
            
            # Format conversation history for the model
            # Limited to last 5 exchanges to avoid token overflow
            if conversation_data and len(conversation_data) > 0:
                # Take last 5 exchanges at most to avoid context length issues
                recent_history = conversation_data[-5:] if len(conversation_data) > 5 else conversation_data
                for entry in recent_history:
                    if "user" in entry:
                        full_prompt += f"User: {entry['user']}\n"
                    if "ai" in entry:
                        full_prompt += f"Tharav: {entry['ai']}\n"
            
            # Add current query
            full_prompt += f"User: {text}\nTharav:"
            
            # Generate the response with improved parameters for more diverse responses
            response = text_generator(
                full_prompt,
                max_length=500,
                do_sample=True,
                temperature=0.8,
                top_p=0.92,
                top_k=50,
                repetition_penalty=1.25,
                num_return_sequences=1
            )
            
            generated_text = response[0]["generated_text"]
            
            # Extract just the assistant's response - everything after the last "Tharav:"
            response_parts = generated_text.split("Tharav:")
            ai_response = response_parts[-1].strip()
            
            # Clean up response - remove any trailing User: prompt or additional conversation
            if "User:" in ai_response:
                ai_response = ai_response.split("User:")[0].strip()
                
            # Remove any self-references from the model (sometimes they say "As an AI..." etc)
            ai_response = ai_response.replace("As an AI", "As a therapist")
            ai_response = ai_response.replace("as an AI", "as a therapist")
            
            return {
                "response": ai_response,
                "crisis_mode": False
            }
        else:
            # Enhanced fallback responses if model fails to load
            responses = [
                "I understand what you're saying. Could you tell me more about how that situation affected you?",
                "That sounds challenging. How have you been coping with these feelings?",
                "I appreciate you sharing that with me. What do you think would be a helpful next step?",
                "Your experience matters. Could you share more about what you're hoping to achieve?",
                "I'm here to support you through this. What would feel most helpful right now?",
                "That's really insightful. How long have you been feeling this way?",
                "I'm listening and I care about what you're going through. What else is on your mind?"
            ]
            import random
            return {
                "response": random.choice(responses),
                "crisis_mode": False
            }
    
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 