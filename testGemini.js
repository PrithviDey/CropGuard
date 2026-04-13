require('dotenv').config({path: './backend/.env'});
const axios = require('axios');
async function test() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return console.log("NO KEY FOUND IN .ENV");
  
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      { contents: [{ parts: [{ text: "Respond with exactly one word: success." }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("SUCCESS:", res.data.candidates[0].content.parts[0].text);
  } catch(e) {
    console.log("ERROR:", e.response ? JSON.stringify(e.response.data) : e.message);
  }
}
test();
