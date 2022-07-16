const router = require('express').Router();
const db = require('../../models');

router.get('/', (req, res) => {
  db.Invoice.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.json(err));
});

router.post('/', (req, res) => {
  db.Invoice.create({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put('/:id', ({ body, params }, res) => {
  db.Invoice.findByIdAndUpdate(
    params.id,
    { $push: { history: body } },
    { new: true, runValidators: true }
  )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
