const mongoose = require('mongoose');

const nativeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Native name is required'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

nativeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Native', nativeSchema);
