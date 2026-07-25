const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Firm name is required'],
      trim: true,
    },
    ownerName: {
      type: String,
      trim: true,
      default: '',
    },
    businessType: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    contactNumber1: {
      type: String,
      trim: true,
      default: '',
    },
    contactNumber2: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
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
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      default: null,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      default: null,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      default: null,
    },
    cityRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      default: null,
    },
    countryName: {
      type: String,
      trim: true,
      default: '',
    },
    stateName: {
      type: String,
      trim: true,
      default: '',
    },
    districtName: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

firmSchema.index({ createdAt: -1 });
firmSchema.index({ name: 'text', ownerName: 'text', businessType: 'text', category: 'text' });

module.exports = mongoose.model('Firm', firmSchema);
