# API Reference - ESP32 Device Hub

## Base URL

```
http://localhost:5000/api
```

## Authentication

Semua endpoint kecuali `/auth/login` dan `/auth/register` memerlukan JWT token di header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGc..."
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "token": "eyJhbGc..."
  }
}
```

#### Verify Token

```http
GET /auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "123",
    "email": "user@example.com"
  }
}
```

### Devices

#### Get All Devices

```http
GET /devices
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "device-1",
      "name": "Living Room ESP32",
      "type": "ESP32",
      "ip": "192.168.1.100",
      "mac": "AA:BB:CC:DD:EE:FF",
      "status": "online",
      "lastSeen": "2026-09-10T16:20:00Z"
    }
  ],
  "count": 1
}
```

#### Get Device by ID

```http
GET /devices/{deviceId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "device-1",
    "name": "Living Room ESP32",
    "type": "ESP32",
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF",
    "status": "online",
    "lastSeen": "2026-09-10T16:20:00Z"
  }
}
```

#### Get Device Status

```http
GET /devices/{deviceId}/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deviceId": "device-1",
    "status": "online",
    "uptime": "3 days 2 hours",
    "rssi": -65,
    "cpu_temp": 45.2,
    "memory_free": 102400,
    "lastSeen": "2026-09-10T16:20:00Z"
  }
}
```

#### Send Command to Device

```http
POST /devices/{deviceId}/command
Authorization: Bearer <token>
Content-Type: application/json

{
  "command": "led_toggle",
  "params": {
    "pin": 5,
    "state": "on"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Command sent successfully",
  "data": {
    "deviceId": "device-1",
    "command": "led_toggle",
    "status": "pending"
  }
}
```

#### Get Device Metrics

```http
GET /devices/{deviceId}/metrics
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deviceId": "device-1",
    "metrics": [
      {
        "timestamp": "2026-09-10T16:20:00Z",
        "value": 25.3,
        "metric": "temperature"
      }
    ]
  }
}
```

#### Update Device Settings

```http
PUT /devices/{deviceId}/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Device Name",
  "polling_interval": 30000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device settings updated",
  "data": {
    "id": "device-1",
    "name": "New Device Name",
    "polling_interval": 30000
  }
}
```

#### Restart Device

```http
POST /devices/{deviceId}/restart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Restart command sent to device",
  "data": {
    "deviceId": "device-1",
    "status": "restarting"
  }
}
```

## WebSocket Events

### Connection

```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Device Status Update

```javascript
socket.on('device-status-update', (data) => {
  console.log('Device status updated:', data);
  // {
  //   deviceId: 'device-1',
  //   status: 'online',
  //   metrics: {...}
  // }
});
```

### Send Request

```javascript
socket.emit('request-device-status', 'device-1', (response) => {
  console.log('Response:', response);
});
```

## Error Handling

Semua error response mengikuti format:

```json
{
  "success": false,
  "error": "Error message"
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized / Invalid Token
- `404` - Not Found
- `500` - Internal Server Error
