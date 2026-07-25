const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN, ROLES.MANAGER));
router.get('/stats', dashboardController.getStats);

module.exports = router;
