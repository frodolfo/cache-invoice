const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HistorySchema = new Schema(
  {
    invoiceStatus: {
      type: String,
      trim: true,
      required: 'Enter the invoice status',
    },
    statusDate: {
      type: Date,
      default: Date.now,
      required: 'Enter the date the status was updated',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const History = mongoose.model('History', HistorySchema);

module.exports = { History, HistorySchema };
