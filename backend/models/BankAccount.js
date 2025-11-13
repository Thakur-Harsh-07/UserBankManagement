const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    ifscCode: {
      type: String,
      required: true,
      trim: true
    },
    branchName: {
      type: String,
      required: true,
      trim: true
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

bankAccountSchema.index({ ifscCode: 1 });
bankAccountSchema.index({ bankName: 1 });

module.exports = mongoose.model('BankAccount', bankAccountSchema);

