const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  supporters: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'pending'
  },
  evidence: [String],
  updates: [{
    date: Date,
    content: String
  }]
});

module.exports = mongoose.model('Report', reportSchema);