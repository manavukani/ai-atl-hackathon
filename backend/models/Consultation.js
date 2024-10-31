const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const consultationSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientQuery: {
    type: String,
    required: true
  },
  responses: [responseSchema],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Consultation = mongoose.model('Consultation', consultationSchema);
module.exports = Consultation;