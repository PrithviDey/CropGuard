require('dotenv').config({path: './.env'});
const axios = require('axios');
async function test() {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiResponse = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiApiKey}`);
  console.log("SUCCESS:", JSON.stringify(geminiResponse.data.models.map(m => m.name), null, 2));
}
test();
