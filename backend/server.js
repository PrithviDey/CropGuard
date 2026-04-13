require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Import Models
const User = require('./models/User');
const Field = require('./models/Field');
const Scan = require('./models/Scan');

const app = express();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected ✅");

    // Seed default farmer user if none exists
    try {
      let defaultUser = await User.findOne({ email: 'farmer@cropguard.ai' });
      if (!defaultUser) {
        await User.create({
          email: 'farmer@cropguard.ai',
          password: 'password', // in prod -> bcrypt
          name: 'Demo Farmer'
        });
        console.log('Seeded default Demo Farmer user');
      }
    } catch (e) {
      console.log('Error seeding default user:', e.message);
    }
  })
  .catch(err => console.log(err));

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup multer for image uploads using MemoryStorage so it works securely on Render
const upload = multer({ storage: multer.memoryStorage() });

// Routes

// 1. Auth Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check MongoDB for real user credentials
    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ success: true, token: 'mock-jwt-token-123', user: { id: user._id, name: user.name, email: user.email } });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper function to get default user for unauthenticated requests
const getDefaultUserId = async () => {
  const u = await User.findOne({ email: 'farmer@cropguard.ai' });
  return u ? u._id : null;
};

// 2. Dashboard Endpoint
app.get('/api/dashboard', async (req, res) => {
  try {
    const userId = await getDefaultUserId();

    const totalScans = await Scan.countDocuments({ user: userId });
    const activeDiseases = await Scan.countDocuments({ user: userId, risk: { $in: ['High', 'Medium'] } });
    const recentScans = await Scan.find({ user: userId }).sort({ createdAt: -1 }).limit(5);

    // Convert to format frontend expects
    const formattedScans = recentScans.map(s => ({
      title: s.title,
      status: s.disease === 'Healthy' ? 'Healthy' : `${s.disease} Detected`,
      date: s.dateString,
      ok: s.ok
    }));

    res.json({
      success: true,
      data: {
        stats: { totalScans, activeDiseases, cropHealth: activeDiseases > 0 ? 85 : 100 },
        recentScans: formattedScans
      }
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// 3. Fields Endpoints
app.get('/api/fields', async (req, res) => {
  try {
    const userId = await getDefaultUserId();
    const fields = await Field.find({ user: userId });
    res.json({ success: true, data: fields });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/api/fields', async (req, res) => {
  try {
    const userId = await getDefaultUserId();
    const newField = await Field.create({
      user: userId,
      name: req.body.name || 'New Field',
      crop: req.body.crop || 'Unknown',
      area: req.body.area || '10 Acres',
      status: 'healthy',
      risk: 'Low',
      lastScan: 'Just now'
    });
    res.json({ success: true, data: newField });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// 4. Scanner Endpoint (Using Gemini 1.5 Flash Vision API)
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const isMock = !geminiApiKey || geminiApiKey === 'your_key_here';

    let aiResult;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    if (!isMock) {
      try {
        console.log('Sending image to Google Gemini API...');
        const imageAsBase64 = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype || "image/jpeg";

        const geminiResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: "You are an expert botanist AI. Analyze the attached image. If it does NOT clearly contain a plant, leaf, or crop, respond with { \"isPlant\": false } and absolutely nothing else. If it IS a plant, analyze its health and respond strictly in this JSON format without markdown blocks: { \"isPlant\": true, \"disease\": \"Healthy\" or name of disease, \"confidence\": integer 1-100, \"crop\": \"Name of crop\", \"risk\": \"Low\" | \"Medium\" | \"High\", \"description\": \"Short explanation\", \"action\": [\"action 1\"], \"products\": [\"product 1\"] }"
                  },
                  {
                    inlineData: {
                      mimeType: mimeType,
                      data: imageAsBase64
                    }
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2
            }
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const candidate = geminiResponse.data.candidates[0];
        
        if (!candidate.content) {
          console.log("Gemini blocked the image (safety/face filter):", candidate.finishReason);
          aiResult = {
            disease: 'Plant Not Recognized (AI Block)',
            confidence: 100,
            crop: 'Unknown',
            risk: 'Low',
            description: 'This image was blocked by Gemini AI safety filters (likely because it contains a person, face, or unsupported content). Please upload a clear photo of a plant leaf instead!',
            action: ['Upload a valid plant image'],
            products: []
          };
        } else {
          const responseText = candidate.content.parts[0].text;
          
          // Clean JSON string to prevent markdown block parsing errors
          const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const geminiData = JSON.parse(cleanJsonText);

          if (!geminiData.isPlant) {
            aiResult = {
              disease: 'Plant Not Recognized',
              confidence: 100,
              crop: 'Unknown',
              risk: 'Low',
              description: 'The uploaded image does not appear to contain a recognizable plant. Please upload a clear photo of leaves, stems, or fruits.',
              action: ['Upload a clearer plant image'],
              products: []
            };
          } else {
            aiResult = {
              disease: geminiData.disease || 'Unknown Disease',
              confidence: geminiData.confidence || 85,
              crop: geminiData.crop || 'Detected Plant',
              risk: geminiData.risk || 'Medium',
              description: geminiData.description || 'Analysis complete.',
              action: geminiData.action || ['Monitor plant closely'],
              products: geminiData.products || []
            };
          }
        }
      } catch (geminiError) {
        console.error('Gemini API Error:', geminiError?.response?.data || geminiError.message);
        throw new Error('Gemini API parsing or request failed');
      }
    } else {
      console.log('Using simple mock fallback since GEMINI_API_KEY is missing');
      await new Promise(r => setTimeout(r, 1500)); // Simulate delay
      
      const possibleResults = [
        { disease: 'Early Blight', confidence: 96, crop: 'Tomato Plant', risk: 'High', description: 'Early blight is a common disease affecting tomatoes. Fungal infection can rapidly spread if untreated.', action: ['Remove lower leaves to increase airflow', 'Apply fungicide every 7-10 days'], products: ['Copper-based fungicide (e.g. Liquid Copper Soap)', 'Chlorothalonil fungicide', 'Balanced NPK fertilizer (5-10-5) to boost plant resilience'] },
        { disease: 'Powdery Mildew', confidence: 89, crop: 'Apple Tree', risk: 'Medium', description: 'Leaves display white powdery spots blocking photosynthesis.', action: ['Improve air circulation', 'Prune affected parts quickly'], products: ['Sulfur-based fungicidal spray', 'Neem Oil Extract', 'Avoid high-nitrogen fertilizers which provoke excessive vulnerable growth'] },
        { disease: 'Healthy', confidence: 99, crop: 'Unknown Plant', risk: 'Low', description: 'No signs of disease detected. Plant appears healthy.', action: ['Continue regular maintenance'], products: ['Standard all-purpose liquid fertilizer', 'Organic compost'] }
      ];
      
      // Hash the image to consistently pick the same mock response
      const hash = crypto.createHash('md5').update(req.file.buffer).digest('hex');
      const intValue = parseInt(hash.substring(0, 8), 16);
      aiResult = possibleResults[intValue % possibleResults.length];
    }

    const userId = await getDefaultUserId();

    await Scan.create({
      user: userId,
      title: `${aiResult.crop} Scan`,
      disease: aiResult.disease,
      confidence: aiResult.confidence,
      risk: aiResult.risk,
      description: aiResult.description,
      action: aiResult.action,
      products: aiResult.products,
      ok: aiResult.risk === 'Low',
      dateString: 'Just now'
    });

    res.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('Scan Error:', error.message);
    res.status(500).json({ success: false, message: 'API Call Failed' });
  }
});

// Start Server
app.listen(port, () => {
  console.log("Server running 🚀");
});
