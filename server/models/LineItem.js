const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LineItemSchema = new Schema(
  {
    item_name: {
      type: String,
      trim: true,
      required: 'Enter the name of the item',
    },
    item_price: {
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
