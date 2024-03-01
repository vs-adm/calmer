import express from 'express';
import fetch from 'node-fetch';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

let currentHint = null;

// Middlewares
app.use(express.static('public')); // Serve static files from public directory
app.use(express.json()); // Parse JSON bodies (for API calls)

async function nextHint() {
  const prompt =
    'You are a highly experienced and empathetic meditation coach with a deep ' +
    'understanding of various techniques to foster calmness and happiness. ' +
    'In your current session, your client is seeking guidance to navigate through ' +
    'their thoughts and emotions. Drawing from your extensive toolkit of ' +
    'mindfulness practices, positive affirmations, and tranquil imagery, share ' +
    'a unique and insightful thought. This thought should be designed to resonate ' +
    'deeply with your client, offering them a moment of peace, clarity, and joy ' +
    'in their journey towards inner serenity. Say EXACTLY one thought.';

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4-turbo-preview',
    });

    currentHint = chatCompletion.choices[0].message.content.trim();
    currentHint = currentHint.replace(/^"|"$/g, '');

    return currentHint;
  } catch (error) {
    console.error('Error:', error);
    currentHint = null;
    return null;
  }
}

// Route for the main page
app.get('/', (req, res) => {
  res.render('index', { soundUrl: process.env.SOUND_STREAM_URL });
});

// Route for handling TTS synthesis
app.get('/synthesize', async (req, res) => {
  const textToSpeak = currentHint;
  const voiceId = 'piTKgcLEGmPE4e6mEKli'; // Nicole
  const options = {
    method: 'POST',
    headers: {
      Accept: 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      model_id: 'eleven_monolingual_v1', // Replace with your actual model ID
      text: textToSpeak,
      voice_settings: {
        stability: 0.39,
        similarity_boost: 0.75,
      },
    }),
  };

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      options
    );
    const data = await response;

    if (!response.ok) {
      throw new Error(data.message || 'Failed to synthesize speech');
    }

    // Set the content type to audio/mpeg as we're streaming audio back to the client
    res.setHeader('Content-Type', 'audio/mpeg');

    // Pipe the audio stream directly to the response
    data.body.pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error synthesizing speech: ${error.message}`);
  }
});

app.get('/chat', async (req, res) => {
  const message = await nextHint();

  if (!message) {
    res.status(500).send(`Error getting response`);
  } else {
    res.json({ message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
