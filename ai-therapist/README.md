# AI Therapist

An AI-powered therapeutic companion that uses speech recognition, sentiment analysis, and natural language processing to provide emotional support, inspired by calmi.so.

## 🌟 Key Features

- **Voice Input**: Speak naturally with our AI therapist
- **Text Chat**: Type your thoughts and feelings
- **Sentiment Analysis**: AI adapts to your emotional state
- **Real-time Responses**: Get immediate supportive feedback
- **Crisis Detection**: Special handling for sensitive situations
- **Beautiful UI**: Calming interface with animations and 3D effects

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- NPM or Yarn

### Project Structure

```
ai-therapist/
├── frontend-vite/       # React/Vite frontend with TypeScript
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── App.tsx      # Main application
│
└── backend/             # FastAPI backend
    ├── main.py          # FastAPI application
    └── requirements.txt # Python dependencies
```

## 📋 Installation & Setup

### Quick Setup (Recommended)

For a streamlined setup experience, run:

```bash
npm run setup
```

This will automatically:

1. Install root dependencies
2. Set up the Python virtual environment and install backend dependencies
3. Install frontend dependencies

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ai-therapist/backend
   ```

2. Create a virtual environment:

   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/macOS
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   npm run setup
   # or manually with
   # pip install -r requirements.txt
   ```

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ai-therapist/frontend-vite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## 🚀 Running the Application

### Running Both Frontend and Backend

To run the complete application (both frontend and backend):

```bash
npm run dev
```

This will start both servers concurrently. The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

### Running Frontend Only

```bash
npm run frontend
```

The frontend will be available at `http://localhost:5173`.

### Running Backend Only

```bash
npm run backend
```

The API will be available at `http://localhost:8000`.

## 🧠 How It Works

1. **Speech Recognition**: Uses OpenAI Whisper to convert your speech to text
2. **Sentiment Analysis**: VADER sentiment analysis detects your emotional state
3. **AI Response Generation**: TinyLlama generates appropriate, supportive responses
4. **Beautiful UI**: Framer Motion provides a calming, animated interface

## 📱 Pages

- **Therapist App**: The main therapist interface with chat functionality
- **Landing Page**: Introduction to the application
- **Pricing Page**: Plan options
- **Features Page**: Detailed features
- **About Page**: Information about the project

## 🛡️ Important Note

This application is a prototype and not a replacement for professional mental health support. If you're experiencing a crisis, please contact a mental health professional or crisis hotline.

## 📝 License

This project is open source, licensed under the MIT License.
