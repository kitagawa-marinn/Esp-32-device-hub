// Mock device data - in production, use database
const devices = new Map();

const deviceController = {
  getAllDevices: async (req, res) => {
    try {
      const deviceList = Array.from(devices.values());
      res.json({
        success: true,
        data: deviceList,
        count: deviceList.length
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getDeviceById: async (req, res) => {
    try {
      const { id } = req.params;
      const device = devices.get(id);

      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found' });
      }

      res.json({ success: true, data: device });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getDeviceStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const device = devices.get(id);

      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found' });
      }

      res.json({
        success: true,
        data: {
          deviceId: id,
          status: device.status,
          uptime: device.uptime,
          rssi: device.rssi,
          cpu_temp: device.cpu_temp,
          memory_free: device.memory_free,
          lastSeen: new Date()
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  sendCommand: async (req, res) => {
    try {
      const { id } = req.params;
      const { command, params } = req.body;
      const device = devices.get(id);

      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found' });
      }

      console.log(`Sending command "${command}" to device ${id}`, params);

      res.json({
        success: true,
        message: 'Command sent successfully',
        data: {
          deviceId: id,
          command,
          status: 'pending'
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getDeviceMetrics: async (req, res) => {
    try {
      const { id } = req.params;
      const device = devices.get(id);

      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found' });
      }

      res.json({
        success: true,
        data: {
          deviceId: id,
          metrics: [
            { timestamp: new Date(), value: 25.3, metric: 'temperature' },
            { timestamp: new Date(), value: 65, metric: 'humidity' },
            { timestamp: new Date(), value: 75, metric: 'uptime_percentage' }
          ]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  updateDeviceSettings: async (req, res) => {
    try {
      const { id } = req.params;
      const settings = req.body;
      const device = devices.get(id);

      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found' });
      }

      Object.assign(device, settings);
      devices.set(id, device);

      res.json({
        success: true,
        message: 'Device settings updated',
        data: device
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  restartDevice: async (req, res) => {
    try {
      const { id } = req.params;
      const device = devices.get(id);

      if (!device) {
        return res.status(404).json({ success: false, error: 'Device not found' });
      }

      res.json({
        success: true,
        message: 'Restart command sent to device',
        data: { deviceId: id, status: 'restarting' }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = { deviceController };
