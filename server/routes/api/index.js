const router = require('express').Router();
const invoiceRoutes = require('./invoice-routes');

router.use('/invoices', invoiceRoutes);

module.exports = router;
