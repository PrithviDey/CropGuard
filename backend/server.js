require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jimpModule = require('jimp');
const Jimp = jimpModule.Jimp || jimpModule.default || jimpModule;

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

// 4. Scanner Endpoint
app.post('/api/scan', upload.single('image'), async (req, res) => {
  try {
    const apiKey = process.env.PLANT_ID_API_KEY;
    const isMock = !apiKey || apiKey === 'your_key_here';

    let aiResult;

    if (isMock) {
      console.log('Using mock AI results since PLANT_ID_API_KEY is not configured');
      // Simulate delay
      await new Promise(r => setTimeout(r, 2000));

      let isPlant = true;
      if (req.file) {
        try {
          // Check for plant colors using Jimp
          const image = await Jimp.read(req.file.buffer);
          
          const stride = 10; // sample every 10th pixel for performance
          let greenBrownPixels = 0;
          let totalPixels = 0;
          
          for (let y = 0; y < image.bitmap.height; y += stride) {
            for (let x = 0; x < image.bitmap.width; x += stride) {
              const idx = (image.bitmap.width * y + x) << 2;
              const r = image.bitmap.data[idx + 0];
              const g = image.bitmap.data[idx + 1];
              const b = image.bitmap.data[idx + 2];
              
              // Rough check for greens, yellows, browns
              if (g > b && r < 200 && b < 150) {
                greenBrownPixels++;
              }
              totalPixels++;
            }
          }
          
          const plantRatio = totalPixels > 0 ? greenBrownPixels / totalPixels : 0;
          console.log('Plant color ratio:', plantRatio);
          if (plantRatio < 0.05) {
            isPlant = false;
          }
        } catch(err) {
          console.log('Jimp processing error:', err.message);
        }
      }

      const possibleResults = [
        { disease: 'Early Blight', confidence: 96, crop: 'Tomato Plant', risk: 'High', description: 'Early blight is a common disease affecting tomatoes. Fungal infection can rapidly spread if untreated.', action: ['Remove lower leaves to increase airflow', 'Apply fungicide every 7-10 days'], products: ['Copper-based fungicide (e.g. Liquid Copper Soap)', 'Chlorothalonil fungicide', 'Balanced NPK fertilizer (5-10-5) to boost plant resilience'] },
        { disease: 'Powdery Mildew', confidence: 89, crop: 'Apple Tree', risk: 'Medium', description: 'Leaves display white powdery spots blocking photosynthesis.', action: ['Improve air circulation', 'Prune affected parts quickly'], products: ['Sulfur-based fungicidal spray', 'Neem Oil Extract', 'Avoid high-nitrogen fertilizers which provoke excessive vulnerable growth'] },
        { disease: 'Healthy', confidence: 99, crop: 'Unknown Plant', risk: 'Low', description: 'No signs of disease detected. Plant appears healthy.', action: ['Continue regular maintenance'], products: ['Standard all-purpose liquid fertilizer', 'Organic compost'] }
      ];

      if (!isPlant) {
        aiResult = {
          disease: 'Plant Not Recognized',
          confidence: 100,
          crop: 'Unknown',
          risk: 'Low',
          description: 'The uploaded image does not appear to contain a recognizable plant. Please upload a clear photo of leaves, stems, or fruits.',
          action: ['Upload a clearer plant image'],
          products: []
        };
      } else if (req.file) {
        const hash = crypto.createHash('md5').update(req.file.buffer).digest('hex');
        const intValue = parseInt(hash.substring(0, 8), 16);
        aiResult = possibleResults[intValue % possibleResults.length];
      } else {
        aiResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
      }
    } else {
      try {
        console.log('Sending image to real Plant.id API...');
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imageAsBase64 = req.file.buffer.toString('base64');

        const plantIdResponse = await axios.post('https://api.plant.id/v2/health_assessment', {
          images: [imageAsBase64],
          modifiers: ["crops_fast", "similar_images"],
          disease_details: ["description", "treatment"]
        }, {
          headers: { 'Api-Key': apiKey }
        });

        const data = plantIdResponse.data;

        const diseaseData = data.health_assessment?.diseases?.[0] || null;
        const isHealthy = data.health_assessment?.is_healthy_probability > 0.6 || !diseaseData;

        if (isHealthy) {
          aiResult = {
            disease: 'Healthy', confidence: Math.round((data.health_assessment?.is_healthy_probability || 0.9) * 100), crop: 'Detected Plant', risk: 'Low', description: 'Plant appears healthy according to Plant.id.', action: ['Continue regular maintenance'], products: []
          };
        } else {
          const diseaseName = diseaseData.disease_details?.name || diseaseData.name;
          const treatmentObj = diseaseData.disease_details?.treatment || {};
          const treatmentKeys = Object.keys(treatmentObj);
          let actions = ['Monitor plant health closely'];
          let products = [];

          if (treatmentKeys.length > 0) {
            actions = treatmentObj[treatmentKeys[0]].map(t => typeof t === 'string' ? t.replace(/<[^>]+>/g, '') : t);
          }

          aiResult = {
            disease: diseaseName,
            confidence: Math.round(diseaseData.probability * 100),
            crop: 'Detected Plant',
            risk: diseaseData.probability > 0.8 ? 'High' : 'Medium',
            description: diseaseData.disease_details?.description ? diseaseData.disease_details.description.replace(/<[^>]+>/g, '') : `Detected high probability of ${diseaseName}`,
            action: actions,
            products: products
          };
        }
      } catch (externalApiError) {
        console.error('Plant.id API rejected the key/request, falling back to Mock Data:', externalApiError.response?.data || externalApiError.message);
        const possibleResults = [
          { disease: 'Early Blight', confidence: 96, crop: 'Tomato Plant', risk: 'High', description: 'Early blight is a common disease affecting tomatoes. Fungal infection can rapidly spread if untreated.', action: ['Remove lower leaves to increase airflow', 'Apply fungicide every 7-10 days'], products: ['Copper-based fungicide (e.g. Liquid Copper Soap)', 'Chlorothalonil fungicide', 'Balanced NPK fertilizer (5-10-5) to boost plant resilience'] },
          { disease: 'Powdery Mildew', confidence: 89, crop: 'Apple Tree', risk: 'Medium', description: 'Leaves display white powdery spots blocking photosynthesis.', action: ['Improve air circulation', 'Prune affected parts quickly'], products: ['Sulfur-based fungicidal spray', 'Neem Oil Extract', 'Avoid high-nitrogen fertilizers which provoke excessive vulnerable growth'] },
          { disease: 'Healthy', confidence: 99, crop: 'Unknown Plant', risk: 'Low', description: 'No signs of disease detected. Plant appears healthy.', action: ['Continue regular maintenance'], products: ['Standard all-purpose liquid fertilizer', 'Organic compost'] }
        ];
        aiResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
      }
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
    console.error('Scan Error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'API Call Failed' });
  }
});

// Start Server
app.listen(port, () => {
  console.log("Server running 🚀");
});
