# Architecture - ESP32 Device Hub

## System Overview

ESP32 Device Hub adalah sistem terdistribusi untuk mendeteksi, memantau, dan mengelola perangkat ESP32 di jaringan lokal.

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Web Browser   │◄───────►│  React Frontend  │◄───────►│  Express Backend│
└─────────────────┘  HTTP   └──────────────────┘ REST API└─────────────────┘
                              WebSocket                          │
                                                                  │
                                                    ┌─────────────┼──────────┐
                                                    │             │          │
                                                    ▼             ▼          ▼
                                            ┌────────────┐ ┌──────────┐ ┌──────────┐
                                            │ Discovery  │ │ Database │ │ Scheduler│
                                            │  Service   │ │(Optional)│ │          │
                                            └────────────┘ └──────────┘ └──────────┘
                                                    │
                                                    │ mDNS
                                                    ▼
                                            ┌─────────────────┐
                                            │  ESP32 Devices  │
                                            │  on Local Net   │
                                            └─────────────────┘
```

## Components

### Frontend (React)

**Lokasi:** `frontend/src/`

- **Pages:** Halaman utama aplikasi
  - `LoginPage.js` - Autentikasi user
  - `DashboardPage.js` - Tampilan utama daftar device
  - `DeviceDetailsPage.js` - Detail device

- **Components:** Komponen reusable
  - `Header.js` - Navigation header
  - `DeviceList.js` - Grid/list device
  - `DeviceCard.js` - Card individual device

- **Services:** Abstraksi API
  - `apiService.js` - HTTP client untuk backend
  - `socketService.js` - WebSocket client

### Backend (Node.js + Express)

**Lokasi:** `backend/src/`

#### Server Core

- `server.js` - Entry point, setup Express dan Socket.IO

#### Routes

- `routes/authRoutes.js` - Endpoints autentikasi
- `routes/deviceRoutes.js` - Endpoints device management

#### Controllers

- `controllers/authController.js` - Logika autentikasi
- `controllers/deviceController.js` - Logika device management

#### Middleware

- `middleware/authMiddleware.js` - JWT verification
- `middleware/errorHandler.js` - Error handling (optional)

#### Services

- `services/discoveryService.js` - mDNS device discovery
- `services/deviceService.js` - Device communication (optional)
- `services/metricsService.js` - Metrics collection (optional)

### Firmware (Arduino)

**Lokasi:** `firmware/`

- `esp32_main.ino` - Program utama device
- `config.h` - Konfigurasi device
- `libraries/` - Custom libraries

## Data Flow

### Device Discovery Flow

```
1. Discovery Service starts
   ↓
2. Scan jaringan menggunakan mDNS
   ↓
3. Device merespons dengan info (nama, IP, MAC)
   ↓
4. Server menyimpan device ke memory/database
   ↓
5. Broadcast ke connected clients via WebSocket
```

### Device Status Update Flow

```
1. Client request device status via REST API
   ↓
2. Backend query device via HTTP/WebSocket
   ↓
3. Device mengirim status (online, metrics, uptime)
   ↓
4. Backend process dan format response
   ↓
5. Return ke frontend
   ↓
6. Frontend update UI dan cache
```

### Remote Command Flow

```
1. User klik button di frontend (e.g., "LED ON")
   ↓
2. Frontend POST /devices/{id}/command
   ↓
3. Backend validate dan route command
   ↓
4. Send HTTP/WebSocket ke device
   ↓
5. Device execute command
   ↓
6. Device send acknowledgement
   ↓
7. Backend notify frontend via WebSocket
   ↓
8. Frontend update UI
```

## Authentication & Security

### JWT Authentication

1. User register/login → server generate JWT token
2. Token disimpan di localStorage
3. Setiap request include token di header: `Authorization: Bearer <token>`
4. Backend verify token menggunakan `authMiddleware`
5. Token expire setelah 7 hari (configurable)

### Password Security

- Password di-hash menggunakan bcryptjs
- Salt rounds: 10
- Server tidak pernah return plain password

## Database Schema (Optional - MongoDB)

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}

// Devices Collection
{
  _id: ObjectId,
  userId: ObjectId (reference to Users),
  deviceId: String (unique),
  name: String,
  type: String,
  ip: String,
  mac: String,
  status: String (online/offline),
  lastSeen: Date,
  settings: Object,
  createdAt: Date,
  updatedAt: Date
}

// Metrics Collection
{
  _id: ObjectId,
  deviceId: String,
  timestamp: Date,
  temperature: Number,
  humidity: Number,
  uptime: Number,
  memory_free: Number,
  rssi: Number
}
```

## Communication Protocols

### REST API

- Digunakan untuk: Device listing, metrics fetch, settings update
- Format: JSON
- Auth: Bearer token

### WebSocket

- Digunakan untuk: Real-time status updates, live metrics
- Events: device-status-update, device-offline, command-response
- Auto-reconnect: Implemented di client

### mDNS

- Digunakan untuk: Auto-discovery device di local network
- Service type: `_esp32._tcp.local`
- Query interval: 30 detik (configurable)

## Deployment Architecture

### Development

```
Localhost:3000 (Frontend) ──┐
                             ├─► Localhost:5000 (Backend)
Localhost:3000 (WebSocket) ─┘
```

### Production (Docker)

```
Nginx (Reverse Proxy)
  ├─► Port 80/443
  │
  ├─► Backend Service (Port 5000)
  │    └─► MongoDB (Port 27017)
  │
  └─► Frontend Service (Port 3000)
```

### Production (Standalone)

```
Nginx
  ├─► Port 80/443
  │
  ├─► Node.js Backend + React Build
  │    (Same port - /api untuk backend, / untuk frontend)
  │
  └─► MongoDB (Separate server)
```

## Scalability Considerations

1. **Database:** MongoDB untuk persistent storage
2. **Cache:** Redis untuk caching metrics
3. **Queue:** Bull/RabbitMQ untuk command queue
4. **Load Balancer:** Nginx untuk multiple backend instances
5. **Clustering:** Node.js cluster module

## Error Handling

- Global error handler middleware
- Device communication timeout: 5 detik
- Retry logic untuk failed commands
- Error logging ke file/service (Winston/Sentry)

## Performance Optimization

- Frontend: Code splitting, lazy loading
- Backend: Request caching, connection pooling
- Compression: gzip untuk HTTP responses
- Database: Indexing untuk frequently queried fields
- WebSocket: Message batching, throttling
