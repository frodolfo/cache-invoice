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
    due_date: new Date(2022, 07, 01),
    total: 35000,
    invoice_status: 'paid',
    history: [
      {
        status: 'draft',
        statusDate: new Date(2022, 06, 21),
      },
      {
        status: 'approved',
        statusDate: new Date(2022, 06, 24),
      },
      {
        status: 'sent',
        statusDate: new Date(2022, 06, 25),
      },
      {
        status: 'paid',
        statusDate: new Date(2022, 06, 30),
      },
    ],
  },
  {
    customer_email: 'jane.doe@femail.com',
    customer_name: 'Jane Doe',
    description: 'Subscription',
    due_date: new Date(2022, 07, 15),
    total: 23500,
    invoice_status: 'sent',
    history: [
      {
        status: 'draft',
        statusDate: new Date(2022, 07, 04),
      },
      {
        status: 'approved',
        statusDate: new Date(2022, 07, 05),
      },
      {
        status: 'sent',
        statusDate: new Date(2022, 07, 07),
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
