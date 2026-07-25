const mongoose = require('mongoose');

const familySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Family name is required'],
      trim: true,
    },
    headName: {
      type: String,
      required: [true, 'Family head name is required'],
      trim: true,
    },
    memberCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    city: {
      type: String,
      trim: true,
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
    address: {
      type: String,
      trim: true,
      default: '',
    },
    parentFamily: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      default: null,
    },
    associatedFirms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
      },
    ],
    native: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Native',
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

familySchema.index({ createdAt: -1 });
familySchema.index({ name: 'text', headName: 'text' });

module.exports = mongoose.model('Family', familySchema);
