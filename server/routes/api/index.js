const router = require('express').Router();
const invoiceRoutes = require('./invoice-routes');

router.use('/invoice', invoiceRoutes);

module.exports = router;
