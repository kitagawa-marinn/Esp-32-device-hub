# ESP32 Device Hub

Modern web dashboard untuk menemukan, memantau, dan mengelola perangkat ESP32 di jaringan lokal.

## 🎯 Fitur Utama

- 🔍 **Auto-Discovery**: Deteksi otomatis perangkat ESP32 menggunakan mDNS
- 📊 **Dashboard Real-time**: Monitoring status dan performa perangkat
- 🎮 **Remote Control**: Kontrol perangkat dari web atau aplikasi mobile
- 📈 **Analytics**: Pelacakan data historis dan statistik
- 🔐 **Security**: Autentikasi dan enkripsi yang aman
- 📱 **Cross-Platform**: Web dashboard + aplikasi mobile

## 🏗️ Arsitektur Proyek

```
esp32-device-hub/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── middleware/
│   ├── package.json
│   └── .env.example
├── frontend/               # React web dashboard
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── package.json
├── mobile/                 # React Native app
│   ├── src/
│   ├── app.json
│   └── package.json
├── firmware/              # Arduino/MicroPython code
│   ├── esp32_main.ino
│   ├── config.h
│   └── libraries/
├── docs/                  # Dokumentasi
│   ├── API.md
│   ├── SETUP.md
│   └── ARCHITECTURE.md
└── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+ (untuk ESP32)
- Arduino IDE atau PlatformIO

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### ESP32 Firmware
Lihat `firmware/README.md` untuk panduan upload firmware ke perangkat.

## 📡 API Endpoints

- `GET /api/devices` - Daftar semua perangkat terdeteksi
- `GET /api/devices/:id` - Detail perangkat spesifik
- `POST /api/devices/:id/command` - Kirim perintah ke perangkat
- `GET /api/devices/:id/status` - Status real-time perangkat
- `WS /api/ws` - WebSocket untuk live updates

## 📚 Dokumentasi

Lihat folder `docs/` untuk dokumentasi lengkap:
- [Setup Guide](./docs/SETUP.md)
- [API Reference](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)

## 🤝 Kontribusi

Silakan buat issue atau pull request untuk saran dan perbaikan!

## 📄 Lisensi

MIT License
