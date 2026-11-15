module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Securely pull the API key from Vercel's environment variables
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'API key is missing on the server.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body) // Forward the request from the frontend
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Backend Error:', error);
    res.status(500).json({ error: 'Failed to communicate with Groq' });
  }
};
