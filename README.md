# GDGShopzy

> A modern e-commerce platform with multi-role support (Buyer, Seller, Employee)

## 📖 About

GDGShopzy is a full-stack e-commerce application built with modern web technologies. It features a comprehensive multi-role system supporting Buyers, Sellers, and Employees, each with tailored functionalities. The platform includes product management, shopping cart, order processing, secure authentication, and file storage capabilities.

**Key Features:**

- 🛒 Complete shopping cart and checkout flow
- 👥 Multi-role authentication (Buyer, Seller, Employee)
- 📦 Product catalog with image uploads
- 🔐 JWT-based secure authentication
- 💳 Order management and tracking
- 📊 Redis caching for performance
- 🗄️ MinIO object storage for media files

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client["Frontend (React + Vite)"]
        UI[React UI]
        State[Zustand State]
        Router[React Router]
    end

    subgraph Server["Backend (Node.js + Express)"]
        API[REST API]
        Auth[JWT Auth]
        Upload[File Upload]
    end

    subgraph Storage["Data Layer"]
        DB[(PostgreSQL + Prisma)]
        Cache[(Redis)]
        Files[(MinIO)]
    end

    UI --> State
    State --> Router
    Router --> API
    API --> Auth
    API --> Upload
    Auth --> DB
    API --> Cache
    Upload --> Files
    API --> DB
```

## 🛠️ Tech Stack

[![Tech Stack](https://skillicons.dev/icons?i=react,vite,nodejs,express,postgres,redis,docker,git,github,npm&perline=10)](https://skillicons.dev)

![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4C3A2A?style=for-the-badge&logo=react&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=for-the-badge&logo=minio&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose

### Development

```bash
# Install dependencies
npm install

# Start development environment
npm run docker:dev

# Run client & server
npm run dev
```

### Production

```bash
# Build all apps
npm run build

# Deploy with Docker
npm run docker:prod:build
```

## 📊 WakaTime Stats

### Development Time Breakdown

<div align="center">
  <img src="wakatime/wakatime-1.png" alt="WakaTime Stats 1" width="800"/>
</div>

<div align="center">
  <img src="wakatime/wakatime-2.png" alt="WakaTime Stats 2" width="800"/>
</div>

## 📝 License

This project is licensed under the MIT License.
