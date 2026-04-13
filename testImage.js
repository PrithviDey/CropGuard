require('dotenv').config({path: './backend/.env'});
const axios = require('axios');

async function test() {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.log("No key found");
    return;
  }
  
  // Create a 1x1 valid base64 PNG image
  const imageAsBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  const mimeType = "image/png";
  
  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [{
            parts: [
              { text: "Respond with exactly one word: success." },
              { inlineData: { mimeType: mimeType, data: imageAsBase64 } }
            ]
        }],
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("SUCCESS:", JSON.stringify(geminiResponse.data, null, 2));
  } catch(e) {
    console.log("AXIOS ERROR:", e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  }
}
test();
