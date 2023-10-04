
const express = require('express');

const summaryController = require('../controllers/summary');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', isAuth, summaryController.getIndex);

 router.get('/products/:_id', summaryController.getProduct);

module.exports = router;
