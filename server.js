import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '1mb' }));

// Streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, systemPrompt, apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required. Add it in Settings.' });
  }

  const client = new Anthropic({ apiKey });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    stream.on('text', (text) => {
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    });

    await stream.finalMessage();

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

// Non-streaming endpoint for weekly digest
app.post('/api/digest', async (req, res) => {
  const { messages, systemPrompt, apiKey } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'API key required.' });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages,
    });

    const content = response.content[0];
    if (content.type === 'text') {
      res.json({ text: content.text });
    } else {
      res.json({ text: '' });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API proxy running on http://localhost:${PORT}`);
});
