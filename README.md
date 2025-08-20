# Chinese Tutor App

A comprehensive Mandarin learning application with Pinyin to Chinese character conversion, pronunciation evaluation, and interactive quizzes.

## Features

- **Pinyin Converter**: Continuous buffering system for typing Chinese characters
- **Character Management**: Add, edit, and delete Chinese characters with mnemonics
- **Pronunciation Evaluation**: AI-powered pronunciation feedback using OpenAI Whisper
- **Interactive Quizzes**: Test your knowledge with customizable quizzes
- **Sentence Generation**: AI-generated practice sentences using your vocabulary
- **HSK 1-4 Coverage**: Comprehensive vocabulary database

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: Supabase
- **AI Services**: OpenAI (Whisper, GPT-4)
- **File Storage**: Cloudinary
- **Deployment**: Render.com

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chinese-tutor-app.git
   cd chinese-tutor-app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Open the frontend**
   - Open `public/index.html` in your browser
   - Or serve it with a local server

### Environment Variables

Create a `.env` file with:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## Deployment on Render

### Backend Service

1. **Connect your GitHub repo** to Render
2. **Create a new Web Service**
3. **Configure:**
   - **Name**: `chinese-tutor-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: `10000`

4. **Add Environment Variables** (from your `.env` file)

### Frontend Service

1. **Create a new Static Site**
2. **Configure:**
   - **Name**: `chinese-tutor-frontend`
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `public`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/characters` - Get all characters
- `POST /api/characters` - Save new character
- `DELETE /api/characters/:id` - Delete character
- `POST /api/evaluate-pronunciation` - Evaluate pronunciation
- `POST /api/generate-sentences` - Generate practice sentences

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
