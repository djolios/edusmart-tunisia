// --- FINAL WORKING CODE - THIS IS THE ONE ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');

// هذا السطر ضروري جداً لـ Vercel و Render. يقرأ المنفذ من متغيرات البيئة، وإذا لم يجده يستخدم 3000 للعمل المحلي.
const port = process.env.PORT || 3000;

// Config
app.use(cors());
app.use(express.json());

// Simple healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  console.log('Incoming /api/chat request - body:', req.body);

  try {
    const { message } = req.body;
    if (!message) {
      console.warn('Bad request: no message provided');
      return res.status(400).json({ error: 'الرسالة مطلوبة' });
    }

    // هذا السطر يقرأ مفتاح API الخاص بـ Gemini من متغيرات البيئة
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not set in environment');
      return res.status(500).json({ error: 'Server misconfiguration: GEMINI_API_KEY missing' });
    }

    // Call Gemini API with the correct and stable model name
    const geminiResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `أنتِ ليسا، مساعدة ذكية لمنصة EduSmart Tunisia. كن مفيدة ودودة ومناسبة للسياق التعليمي في تونس. السؤال هو: ${message}`
          }]
        }]
      })
    });

    if (!geminiResp.ok) {
      const status = geminiResp.status;
      const body = await geminiResp.text();
      console.error('Gemini API error status:', status, 'body:', body);
      return res.status(502).json({ error: 'Gemini API error', status, body });
    }

    const json = await geminiResp.json();
    const aiText = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      console.error('Unexpected Gemini response structure:', json);
      return res.status(502).json({ error: 'Unexpected Gemini response structure', raw: json });
    }

    console.log('✅ SUCCESS! Gemini reply (first 120 chars):', aiText.slice(0, 120));
    return res.json({ reply: aiText });

  } catch (err) {
    console.error('Error in /api/chat handler:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message || String(err) });
  }
});

app.listen(port, () => {
  console.log('------------------------------------');
  console.log(`✅ FINAL SERVER running at http://localhost:${port}`);
  console.log('------------------------------------');
});