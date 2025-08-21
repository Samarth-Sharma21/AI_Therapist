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
- NPM or Yarn

### Project Structure

```
ai-therapist/
├── frontend-vite/       # React/Vite frontend with TypeScript
│   ├── public/
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API services (using OpenRouter directly)
│       └── App.tsx      # Main application
└── .env                 # OpenRouter API configuration
```

## 📋 Installation & Setup

### Quick Setup (Recommended)

For a streamlined setup experience, run:

```bash
npm run setup
```

This will automatically:

1. Install root dependencies
2. Install frontend dependencies
3. Set up OpenRouter configuration

### Manual Setup

#### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ai-therapist/frontend-vite
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure OpenRouter API:

   ```bash
   # Copy the .env file and add your OpenRouter API key
   cp .env .env.local
   # Edit .env.local and replace 'your-openrouter-api-key-here' with your actual API key
   ```

## 🚀 Running the Application

### Running the Application

To start the application:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Running Frontend Only

```bash
npm run frontend
```

The frontend will be available at `http://localhost:5173`.

## 🧠 How It Works

1. **Direct AI Integration**: Uses OpenRouter API for advanced AI responses
2. **Sentiment Analysis**: Simple keyword-based sentiment detection
3. **AI Response Generation**: OpenAI GPT models generate appropriate, supportive responses
4. **Beautiful UI**: Framer Motion provides a calming, animated interface

## 🔧 OpenRouter Configuration

The application now uses OpenRouter's API directly, eliminating the need for a backend server. To configure:

1. Get your API key from [OpenRouter](https://openrouter.ai/keys)
2. Copy the `.env` file to `.env.local`
3. Add your API key to `.env.local`:
   ```
   VITE_OPENROUTER_API_KEY=your-actual-api-key-here
   ```

You can also customize the AI model by changing `VITE_OPENROUTER_MODEL` in the `.env` file.

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
