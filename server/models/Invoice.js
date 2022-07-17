const mongoose = require('mongoose');
const { HistorySchema } = require('./History');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
  {
    customer_email: {
      type: String,
      trim: true,
      required: 'Enter the customer email address',
    },
    customer_name: {
      type: String,
      required: 'Enter the fiull name of the customer',
    },
    description: {
      type: String,
      required: 'Enter description of the invoice',
    },
    due_date: {
      type: Date,
      required: 'Enter due date for the invoice',
    },
    invoice_status: {
      type: String,
      trim: true,
      required: 'Enter the status of the invoice',
    },
    total: {
      type: Number,
      required: 'Enter total amount for the invoice',
    },
    history: [HistorySchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Helper methods
InvoiceSchema.virtual('addHistory').set(function (history) {
  this.history.push(history);
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
