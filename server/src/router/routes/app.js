const router = require('express').Router();
const app = require('../../config/app');

router.get('/app.json', (req, res) => {
  res.json(app);
});

module.exports = router;
