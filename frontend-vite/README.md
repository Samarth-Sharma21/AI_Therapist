# AI Therapist - Frontend

An AI-powered therapeutic companion built with React, TypeScript, and Vite. This application provides mental health support through conversational AI, leveraging advanced language models for empathetic and therapeutic responses.

## 🚀 Features

- **AI-Powered Therapy**: Advanced conversational AI trained in therapeutic techniques
- **Real-time Sentiment Analysis**: Understands emotional context and responds appropriately
- **Voice-to-Text Input**: Browser-based speech recognition for easy communication
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern UI/UX**: Beautiful, calming interface designed for mental wellness

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components + Framer Motion
- **3D Graphics**: React Three Fiber + Three.js
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **AI Integration**: OpenRouter API

## 📦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/samarthsharma/AI_Therapist.git
cd AI_Therapist/frontend-vite
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
VITE_OPENROUTER_MODEL=openai/gpt-3.5-turbo
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy using gh-pages**:
   ```bash
   npm run deploy
   ```

### Automatic Deployment (Recommended)

The project includes a GitHub Actions workflow that automatically deploys to GitHub Pages when you push to the `main` branch.

#### Setup Steps:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Under "Build and deployment", select "GitHub Actions"

2. **Push your changes**:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment**:
   - GitHub Actions will automatically build and deploy your site
   - Check the "Actions" tab in your repository for deployment status
   - Your site will be available at: `https://samarthsharma.github.io/AI_Therapist/`

## 📁 Project Structure

```
frontend-vite/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API services and utilities
│   ├── contexts/         # React contexts
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application component
├── .github/workflows/    # GitHub Actions workflows
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Vite configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

**OpenRouter Configuration:**
- `VITE_OPENROUTER_API_KEY`: Your OpenRouter API key
- `VITE_OPENROUTER_MODEL`: The AI model to use (default: openai/gpt-3.5-turbo)

**Supabase Configuration:**
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

You can copy the `.env.example` file as a template:
```bash
cp .env.example .env.local
```

### Vite Configuration

The project is configured with:
- Base path: `/AI_Therapist/` (for GitHub Pages compatibility)
- React plugin for fast development
- TypeScript support

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages
- `npm run predeploy` - Build before deployment

## 🔒 Security & Privacy

- All API keys are stored in environment variables
- No sensitive data is stored in the browser
- Uses HTTPS for all API communications
- Client-side only - no backend server required

## 🐛 Troubleshooting

### Common Issues

**Build fails with "base path" error**:
- Ensure the `base` property in `vite.config.ts` matches your GitHub repository name

**API calls fail after deployment**:
- Check that your OpenRouter API key is correctly set in environment variables
- Verify CORS settings in your API provider

**404 errors on page refresh**:
- This is expected with GitHub Pages and client-side routing
- Users should navigate using the in-app navigation

### Development Tips

- Use `npm run preview` to test the production build locally
- Check browser console for any API-related errors
- Ensure all environment variables are set correctly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.
