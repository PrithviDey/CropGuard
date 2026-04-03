const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  disease: { type: String, required: true },
  risk: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  confidence: { type: Number, required: true },
  description: { type: String },
  action: [{ type: String }],
  products: [{ type: String }],
  ok: { type: Boolean, default: true },
  dateString: { type: String, default: 'Just now' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Scan', scanSchema);
