const express = require('express');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/verify', authController.getVerify);

router.post(
  '/verify',
  [
      body('name')
      .isLength({ min: 2 })
      .withMessage('Please enter a valid name')
      .isAlphanumeric()
      .trim(),
      body('email')
      .isEmail()
      .withMessage('Please enter a valid email address.')
      .normalizeEmail(),
      body('phone')
      .isMobilePhone()
      .withMessage('Please enter a valid phone number.'),
      body('ID')
      .isLength({ min: 1 })
      .withMessage('Please enter a valid ID.')
      .trim()
  ],
  authController.postVerify
);

router.post('/exit', authController.postExit);

router.get('/report', authController.getReport);

module.exports = router;
