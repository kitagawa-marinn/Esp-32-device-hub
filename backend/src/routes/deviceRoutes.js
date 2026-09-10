const express = require('express');
const router = express.Router();
const { deviceController } = require('../controllers/deviceController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Get all discovered devices
router.get('/', authMiddleware, deviceController.getAllDevices);

// Get device details
router.get('/:id', authMiddleware, deviceController.getDeviceById);

// Get device status
router.get('/:id/status', authMiddleware, deviceController.getDeviceStatus);

// Send command to device
router.post('/:id/command', authMiddleware, deviceController.sendCommand);

// Get device metrics/history
router.get('/:id/metrics', authMiddleware, deviceController.getDeviceMetrics);

// Update device settings
router.put('/:id/settings', authMiddleware, deviceController.updateDeviceSettings);

// Restart device
router.post('/:id/restart', authMiddleware, deviceController.restartDevice);

module.exports = router;
