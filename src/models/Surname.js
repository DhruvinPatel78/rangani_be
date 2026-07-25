const mongoose = require('mongoose');

const surnameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Surname is required'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

surnameSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Surname', surnameSchema);
