# Setup Guide - ESP32 Device Hub

## Prerequisites

- Node.js 18 atau lebih tinggi
- npm atau yarn
- Git
- Python 3.8+ (untuk firmware ESP32)
- Arduino IDE atau PlatformIO

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` dengan pengaturan Anda:

```env
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

### 3. Start Backend Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

Aplikasi akan terbuka di `http://localhost:3000`

## Docker Setup (Optional)

### Build dan Run dengan Docker Compose

```bash
docker-compose up --build
```

Ini akan menjalankan:
- Backend di port 5000
- Frontend di port 3000
- Database MongoDB (jika dikonfigurasi)

## Firmware Setup (ESP32)

### 1. Install Arduino IDE

Download dari: https://www.arduino.cc/en/software

### 2. Install ESP32 Board Package

Ikuti panduan resmi: https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html

### 3. Upload Firmware

```bash
cd firmware
# Buka file esp32_main.ino di Arduino IDE
# Select Board: ESP32 Dev Module
# Select Port: COM3 (atau port Anda)
# Click Upload
```

### 4. Configure Device

Edit `firmware/config.h` untuk mengatur:

```cpp
#define WIFI_SSID "your-wifi-ssid"
#define WIFI_PASSWORD "your-wifi-password"
#define HUB_SERVER_IP "192.168.1.100" // Server backend IP
#define HUB_SERVER_PORT 5000
```

## Testing

### Backend API Test

```bash
curl http://localhost:5000/api/health
```

Harus mengembalikan:
```json
{"status": "ok", "timestamp": ".."}
```

### Login Test

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## Troubleshooting

### Port Already in Use

Jika port 5000 sudah digunakan:

```bash
# Linux/Mac
lsof -i :5000

# Windows
netstat -ano | findstr :5000
```

Ganti port di `.env`:
```env
PORT=5001
```

### CORS Issues

Pastikan `FRONTEND_URL` di `.env` sesuai dengan URL frontend Anda.

### Device Not Detected

1. Pastikan device ESP32 terhubung ke jaringan yang sama dengan server
2. Periksa IP address di device serial monitor
3. Verify mDNS is working: `ping <device-name>.local`

## Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

### Deploy with PM2

```bash
npm install -g pm2
pm2 start backend/src/server.js --name "esp32-hub"
pm2 save
```

### Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
    }

    location / {
        proxy_pass http://localhost:3000;
    }
}
```
