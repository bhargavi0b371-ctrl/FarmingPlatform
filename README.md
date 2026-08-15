# 🌾 EcoFarm - AI-Powered Agricultural Advisory Platform

**A comprehensive full-stack solution for farmers with AI pest detection, weather intelligence, market insights, and multilingual support.**

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [AI/ML Integration](#aiml-integration)
- [Contributing](#contributing)

## ✨ Features

### 1. **Farmer Authentication**
- Mobile number OTP login
- Role-based access (Farmer, Expert, Admin)
- JWT secure authentication
- Profile creation with farm details

### 2. **AI-Powered Advisory System**
- Personalized crop recommendations
- Fertilizer optimization
- Irrigation scheduling
- Seasonal notifications
- AI-generated farming tips

### 3. **Pest & Disease Detection**
- Image-based pest detection
- Confidence scoring
- Treatment recommendations (organic & chemical)
- Diagnosis history
- Prevention guidance

### 4. **Weather & Market Intelligence**
- Real-time weather dashboard
- Extreme weather alerts
- Market price tracking
- Mandi comparison
- Historical trend charts

### 5. **Voice & Multilingual Chatbot**
- Native language support (English, Hindi, Tamil, Telugu)
- Voice input/output
- Conversational guidance
- Low-literacy friendly UI

### 6. **Smart Dashboards**
- Farmer dashboard with crop status, alerts, trends
- Admin analytics with user management
- Pest outbreak heatmaps
- AI usage statistics

### 7. **Advanced Features**
- Satellite crop monitoring support
- IoT sensor integration
- Yield prediction
- Community forum
- Government scheme recommendations
- QR-based verification

## 🛠 Tech Stack

### Frontend
- **Web Dashboard**: Next.js 16 + React 18 + TypeScript + Tailwind CSS
- **Mobile App**: React Native + Expo + TypeScript
- **State Management**: Zustand
- **UI Components**: Lucide Icons, Recharts
- **i18n**: react-i18next

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + OTP (Twilio)
- **API**: REST with OpenAPI/Swagger

### AI/ML
- **Pest Detection**: TensorFlow.js / Custom ML Model
- **Advisory Generation**: OpenAI GPT-4 / Google Gemini
- **Chatbot**: LangChain + LLM

### Infrastructure
- **Cloud Storage**: Firebase Storage / AWS S3
- **Notifications**: Firebase Cloud Messaging
- **Maps**: Google Maps API
- **Weather**: OpenWeather API
- **Deployment**: Docker, Vercel, Render

## 📁 Project Structure

```
EcoFarm/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/        # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── models/            # Database models (Prisma)
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   ├── types/             # TypeScript types
│   │   ├── ai/                # AI/ML integration
│   │   └── index.ts           # Entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js web dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/   # Farmer dashboard
│   │   │   ├── (admin)/       # Admin panel
│   │   │   ├── (auth)/        # Authentication
│   │   │   └── ...
│   │   ├── components/        # Reusable components
│   │   ├── lib/              # Utilities
│   │   ├── hooks/            # Custom hooks
│   │   ├── store/            # State management
│   │   └── types/            # TypeScript types
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── mobile/                     # React Native/Expo app
│   ├── src/
│   │   ├── screens/          # App screens
│   │   ├── components/       # Reusable components
│   │   ├── navigation/       # Navigation structure
│   │   ├── store/            # State management
│   │   ├── services/         # API calls
│   │   ├── utils/            # Helper functions
│   │   ├── types/            # TypeScript types
│   │   └── i18n/             # Translations
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                       # Documentation
│   ├── API.md                 # API endpoints
│   ├── DATABASE.md            # Schema documentation
│   ├── AI_INTEGRATION.md      # AI/ML setup
│   ├── DEPLOYMENT.md          # Deployment guide
│   └── SETUP.md               # Setup instructions
│
└── docker-compose.yml         # Multi-container setup
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose
- Expo CLI (for mobile)

### Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Setup database
npx prisma migrate dev --name init

# Seed initial data
npx prisma db seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Mobile Setup

```bash
cd mobile
npm install
npx expo start
```

## 🔐 Environment Variables

### Backend (.env)
```
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecofarm"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# OTP (Twilio)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE=+1234567890

# Weather API
OPENMETEO_BASE_URL=https://api.open-meteo.com/v1
OPENMETEO_LATITUDE=12.9716
OPENMETEO_LONGITUDE=77.5946

# Optional legacy OpenWeather support
OPENWEATHER_API_KEY=your_api_key

# Maps
OPENSTREETMAP_BASE_URL=https://nominatim.openstreetmap.org
OPENSTREETMAP_USER_AGENT=EcoFarmApp/1.0

# AI/ML
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_AI_STUDIO_API_KEY=your_gemini_api_key

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FIREBASE_CONFIG={"..."}
```

### Mobile (.env)
```
EXPO_PUBLIC_API_URL=http://localhost:3001/api
EXPO_PUBLIC_FIREBASE_CONFIG={"..."}
```

## 📡 API Documentation

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify and get JWT
- `POST /api/auth/register` - Complete profile registration
- `GET /api/auth/me` - Get current user

### Advisory
- `GET /api/advisories` - Get user advisories
- `POST /api/advisories/generate` - Generate AI advisory
- `GET /api/advisories/:id` - Get specific advisory
- `POST /api/advisories/:id/feedback` - Rate advisory

### Pest Detection
- `POST /api/pest-detection/detect` - Detect pests from image
- `GET /api/pest-detection/history` - Get detection history
- `GET /api/pest-detection/:id` - Get specific detection

### Weather
- `GET /api/weather/current` - Current weather
- `GET /api/weather/forecast` - Weather forecast
- `GET /api/weather/alerts` - Weather alerts

### Market
- `GET /api/market/prices` - Get crop prices
- `GET /api/market/trends/:crop` - Price trends
- `GET /api/market/mandis` - Nearby mandis

### Chatbot
- `POST /api/chatbot` - Send message
- `GET /api/chatbot/history` - Chat history

### Admin
- `GET /api/admin/users` - Manage users
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/pest-map` - Pest outbreak heatmap

## 🗄 Database Schema

See `docs/DATABASE.md` for complete schema documentation.

### Key Tables
- `users` - Farmer, Expert, Admin profiles
- `farms` - Farm records and details
- `crops` - Crop information per farm
- `soil_reports` - Soil analysis data
- `weather_logs` - Historical weather data
- `pest_detections` - Disease/pest detection records
- `advisories` - Generated recommendations
- `market_prices` - Commodity pricing
- `notifications` - System alerts
- `feedback` - Advisory ratings
- `chat_history` - Chatbot conversations

## 🤖 AI/ML Integration

### Pest Detection
- Model: TensorFlow.js pretrained model or custom PyTorch model
- Accuracy: 92%+ on common Indian crop pests
- Deployment: Model server or cloud inference

### Advisory Generation
- API: OpenAI GPT-4 or Google Gemini
- Prompts: Soil + Weather + Region → Recommendations
- Caching: Store generated advisories for common scenarios

### Chatbot
- Framework: LangChain + LLM
- Languages: English, Hindi, Tamil, Telugu
- Features: Voice input, low-bandwidth support

See `docs/AI_INTEGRATION.md` for setup details.

## 🐳 Docker Deployment

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📦 Deployment

### Frontend (Vercel)
```bash
vercel deploy --prod
```

### Backend (Render/Railway)
- Connect GitHub repository
- Select Dockerfile
- Set environment variables
- Deploy

See `docs/DEPLOYMENT.md` for detailed instructions.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# Integration tests
npm run test:integration
```

## 📱 Multilingual Support

Supported languages:
- 🇮🇳 **Hindi** (हिंदी)
- 🇮🇳 **Tamil** (தமிழ்)
- 🇮🇳 **Telugu** (తెలుగు)
- 🇬🇧 **English**

Translation files: `mobile/src/i18n/locales/`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Product**: Agricultural Innovation
- **Engineering**: Full-stack Development
- **AI/ML**: ML Engineers
- **Design**: UI/UX Specialists

## 📞 Support

- Email: support@ecofarm.app
- Phone: +91-XXX-XXXX-XXXX
- Website: www.ecofarm.app
- Documentation: docs.ecofarm.app

---

**Made with ❤️ for Indian Farmers**
