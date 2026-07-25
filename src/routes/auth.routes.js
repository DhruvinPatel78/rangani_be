const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const {
  passwordLoginValidators,
  requestOtpValidators,
  verifyOtpValidators,
} = require('../validators/common.validator');

const router = express.Router();

router.post('/identify', requestOtpValidators, validate, authController.identify);
router.post('/login', passwordLoginValidators, validate, authController.login);
router.post('/admin/login', passwordLoginValidators, validate, authController.loginAdmin);
router.post('/manager/login', passwordLoginValidators, validate, authController.loginManager);
router.post('/user/otp/request', requestOtpValidators, validate, authController.requestUserOtp);
router.post('/user/otp/verify', verifyOtpValidators, validate, authController.verifyUserOtp);
router.get('/me', authenticate, authController.getProfile);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
