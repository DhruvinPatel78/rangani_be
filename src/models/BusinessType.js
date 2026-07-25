const mongoose = require('mongoose');

const businessTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Business type name is required'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

businessTypeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BusinessType', businessTypeSchema);
