const express = require('express');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const memberRoutes = require('./member.routes');
const familyRoutes = require('./family.routes');
const firmRoutes = require('./firm.routes');
const locationRoutes = require('./location.routes');
const nativeRoutes = require('./native.routes');
const businessTypeRoutes = require('./businessType.routes');
const surnameRoutes = require('./surname.routes');
const managerRoutes = require('./manager.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rangani Parivaar API is running',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/members', memberRoutes);
router.use('/families', familyRoutes);
router.use('/firms', firmRoutes);
router.use('/locations', locationRoutes);
router.use('/natives', nativeRoutes);
router.use('/business-types', businessTypeRoutes);
router.use('/surnames', surnameRoutes);
router.use('/managers', managerRoutes);

module.exports = router;
