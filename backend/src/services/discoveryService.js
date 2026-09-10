/**
 * Discovery Service - Finds ESP32 devices on network using mDNS
 */

const discoveryService = {
  devices: new Map(),
  isRunning: false,

  start: function() {
    console.log('🔍 Starting ESP32 Discovery Service...');
    this.isRunning = true;

    // Simulate device discovery
    this.mockDiscovery();

    // Set up periodic discovery scan
    this.discoveryInterval = setInterval(() => {
      this.mockDiscovery();
    }, 30000); // Every 30 seconds
  },

  stop: function() {
    console.log('Stopping ESP32 Discovery Service');
    this.isRunning = false;
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }
  },

  mockDiscovery: function() {
    console.log('Scanning for ESP32 devices...');
    // In production, this would use mdns-js to discover devices
    // For now, we'll use mock data
  },

  addDevice: function(device) {
    this.devices.set(device.id, {
      ...device,
      discoveredAt: new Date(),
      status: 'online'
    });
  },

  removeDevice: function(deviceId) {
    this.devices.delete(deviceId);
  },

  getDevices: function() {
    return Array.from(this.devices.values());
  },

  updateDeviceStatus: function(deviceId, status) {
    const device = this.devices.get(deviceId);
    if (device) {
      device.status = status;
      device.lastSeen = new Date();
    }
  }
};

module.exports = { discoveryService };
