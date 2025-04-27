# AI Therapist Backend

FastAPI backend for the AI Therapist application that handles:

- Speech-to-text conversion
- Sentiment analysis
- AI-generated therapeutic responses
- Crisis detection

## Setup

1. Create a virtual environment:

```
python -m venv venv
```

2. Activate the virtual environment:

```
# Windows
venv\Scripts\activate

# Linux/MacOS
source venv/bin/activate
```

3. Install the requirements:

```
pip install -r requirements.txt
```

## Running the server

```
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the server is running, visit `http://localhost:8000/docs` for the Swagger UI documentation.

## Endpoints

- `GET /`: Check if the API is running
- `POST /transcribe/`: Transcribe audio to text using Whisper
- `POST /analyze-sentiment/`: Analyze the sentiment of text
- `POST /generate-response/`: Generate a therapeutic response based on user input

## Model Information

- Speech-to-text: OpenAI Whisper (base model)
- Text generation: TinyLlama-1.1B-Chat
- Sentiment analysis: VADER

## Note on Audio Files

The API accepts WAV files for transcription. For best results:

- Sample rate: 16kHz
- Audio channel: Mono
