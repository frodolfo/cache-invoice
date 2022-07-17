let mongoose = require('mongoose');
let db = require('../models');

mongoose.connect('mongodb://localhost/invoices', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

let invoiceSeed = [
  {
    customer_email: 'john.doe@email.com',
    customer_name: 'John Doe',
    description: 'For services rendered',
    total: 30500,
    due_date: new Date(2022, 07, 01),
    current_status: 'paid',
    line_items: [
      {
        item_name: 'SalesForce',
        item_price: 25000,
      },
      {
        item_name: 'SalesForce Support',
        item_price: 5500,
      },
    ],
    history: [
      {
        invoice_status: 'draft',
        status_date: new Date(2022, 06, 21),
      },
      {
        invoice_status: 'approved',
        status_date: new Date(2022, 06, 24),
      },
      {
        invoice_status: 'sent',
        status_date: new Date(2022, 06, 25),
      },
      {
        invoice_status: 'paid',
        status_date: new Date(2022, 06, 30),
      },
    ],
  },
  {
    customer_email: 'jane.doe@femail.com',
    customer_name: 'Jane Doe',
    description: 'Subscription',
    total: 55500,
    due_date: new Date(2022, 06, 15),
    current_status: 'sent',
    line_items: [
      {
        item_name: 'Microsoft Office Enterprise',
        item_price: 12300,
      },
      {
        item_name: 'SalesForce',
        item_price: 25000,
      },
      {
        item_name: 'Microsoft SQL Server Enterprise',
        item_price: 18200,
      },
    ],
    history: [
      {
        invoice_status: 'draft',
        status_date: new Date(2022, 07, 04),
      },
      {
        invoice_status: 'approved',
        status_date: new Date(2022, 07, 05),
      },
      {
        invoice_status: 'sent',
        status_date: new Date(2022, 07, 07),
      },
    ],
  },
];

//
db.Invoice.deleteMany({})
  .then(() => db.Invoice.collection.insertMany(invoiceSeed))
  .then((data) => {
    console.log(data.result.n + ' invoices added to collection.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error encountered: ' + err);
    process.exit(1);
  });
