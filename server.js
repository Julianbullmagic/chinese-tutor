const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chinese Tutor Backend is running' });
});

// ======================
// Character Management API
// ======================

// Get all characters
app.get('/api/characters', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// Save new character
app.post('/api/characters', async (req, res) => {
  try {
    const { pinyin, meaning, hint, characterImage, mnemonicImage } = req.body;

    // Upload character image to Cloudinary if provided
    let characterImageUrl = null;
    if (characterImage) {
      const result = await cloudinary.uploader.upload(characterImage, {
        folder: 'chinese-tutor/characters'
      });
      characterImageUrl = result.secure_url;
    }

    // Upload mnemonic image to Cloudinary if provided
    let mnemonicImageUrl = null;
    if (mnemonicImage) {
      const result = await cloudinary.uploader.upload(mnemonicImage, {
        folder: 'chinese-tutor/mnemonics'
      });
      mnemonicImageUrl = result.secure_url;
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('characters')
      .insert([
        {
          pinyin,
          meaning,
          hint,
          character_image: characterImageUrl,
          mnemonic_image: mnemonicImageUrl
        }
      ])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error saving character:', error);
    res.status(500).json({ error: 'Failed to save character' });
  }
});

// Delete character
app.delete('/api/characters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

// ======================
// Pronunciation Evaluation API
// ======================

// Evaluate pronunciation using OpenAI Whisper
app.post('/api/evaluate-pronunciation', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    // Convert audio buffer to base64
    const audioBase64 = req.file.buffer.toString('base64');
    const audioDataUrl = `data:${req.file.mimetype};base64,${audioBase64}`;

    // Use OpenAI Whisper to transcribe
    const transcription = await openai.audio.transcriptions.create({
      file: Buffer.from(req.file.buffer),
      model: "whisper-1",
      language: "zh"
    });

    // Use GPT-4 to evaluate pronunciation
    const evaluation = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a Chinese pronunciation expert. Evaluate the pronunciation quality and provide constructive feedback in English. Rate from 1-10 and give specific improvement suggestions."
        },
        {
          role: "user",
          content: `Please evaluate this Chinese pronunciation: "${transcription.text}". Provide a score from 1-10 and specific feedback for improvement.`
        }
      ],
      max_tokens: 300
    });

    res.json({
      transcription: transcription.text,
      evaluation: evaluation.choices[0].message.content
    });
  } catch (error) {
    console.error('Error evaluating pronunciation:', error);
    res.status(500).json({ error: 'Failed to evaluate pronunciation' });
  }
});

// ======================
// Sentence Generation API
// ======================

// Generate quiz sentences using OpenAI
app.post('/api/generate-sentences', async (req, res) => {
  try {
    const { words, sentenceLength } = req.body;

    if (!words || !Array.isArray(words)) {
      return res.status(400).json({ error: 'Words array is required' });
    }

    const prompt = `Generate ${sentenceLength || 5} simple Chinese sentences using these words: ${words.join(', ')}. 
    Each sentence should be appropriate for HSK 1-3 level learners. 
    Return the response as a JSON array with objects containing: 
    { "chinese": "中文句子", "pinyin": "zhōng wén jù zi", "english": "English translation" }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a Chinese language teacher. Generate simple, clear sentences for beginners."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000
    });

    let sentences;
    try {
      sentences = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      sentences = [{
        chinese: "解析失败，请重试",
        pinyin: "jiě xī shī bài, qǐng chóng shì",
        english: "Parsing failed, please try again"
      }];
    }

    res.json(sentences);
  } catch (error) {
    console.error('Error generating sentences:', error);
    res.status(500).json({ error: 'Failed to generate sentences' });
  }
});

// ======================
// Text-to-Speech API
// ======================

// Convert text to speech (using browser's built-in speech synthesis)
app.get('/api/speak/:text', (req, res) => {
  // This endpoint is mainly for compatibility
  // The actual TTS will be handled by the browser
  res.json({ 
    message: 'Text-to-speech is handled by the browser',
    text: req.params.text 
  });
});

// ======================
// Error handling middleware
// ======================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chinese Tutor Backend running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
