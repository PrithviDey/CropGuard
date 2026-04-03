const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  crop: { type: String, required: true },
  area: { type: String, required: true },
  status: { type: String, enum: ['healthy', 'warning', 'needs_attention'], default: 'healthy' },
  risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  lastScan: { type: String, default: 'Never' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Field', fieldSchema);
