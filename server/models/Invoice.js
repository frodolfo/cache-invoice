const mongoose = require('mongoose');
const { HistorySchema } = require('./History');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema(
  {
    customer_email: {
      type: String,
      trim: true,
      required: 'Enter the product name',
    },
    customer_name: {
      type: Number,
      required: 'Enter the list price of product',
    },
    description: {
      type: Number,
      required: 'Enter number of quantity in stock',
    },
    due_date: {
      type: Date,
      required: 'Enter due date for the invoice',
    },
    status: {
      type: String,
      trim: true,
    },
    total: {
      type: Number,
      required: 'Enter total amount for the invoice',
    },
    history: [HistorySchema]
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Helper methods
InvoiceSchema.virtual("addHistory").set(function (history) {
  this.history.push(history);
});

module.exports = { 'Invoice', InvoiceSchema };
