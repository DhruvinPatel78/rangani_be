const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    surname: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    gender: {
      type: String,
      enum: ['male', 'female', ''],
      default: '',
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'engaged', 'married', 'widow', ''],
      default: '',
    },
    occupation: {
      type: String,
      enum: ['child', 'study', 'self_employed', 'service', 'retired', 'homemaker', ''],
      default: '',
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    isAlive: {
      type: Boolean,
      default: true,
    },
    dateOfDeath: {
      type: Date,
      default: null,
    },
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      default: null,
      index: true,
    },
    familyName: {
      type: String,
      trim: true,
      default: '',
    },
    father: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null,
    },
    fatherName: {
      type: String,
      trim: true,
      default: '',
    },
    mother: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null,
    },
    motherName: {
      type: String,
      trim: true,
      default: '',
    },
    spouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null,
    },
    spouseName: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    native: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Native',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

memberSchema.index({ createdAt: -1 });
memberSchema.index({ name: 'text', surname: 'text', email: 'text', phone: 'text', familyName: 'text' });

module.exports = mongoose.model('Member', memberSchema);
