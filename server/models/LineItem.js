const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LineItemSchema = new Schema(
  {
    itmeName: {
      type: String,
      trim: true,
      required: 'Enter the name of the item',
    },
    itemPrice: {
      type: Number,
      required: 'Enter the price of the item',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const LineItem = mongoose.model('LineItem', LineItemSchema);

module.exports = { LineItem, LineItemSchema };
