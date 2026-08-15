# 🗄️ Database Schema Documentation

## Overview

EcoFarm uses PostgreSQL with Prisma ORM for a scalable, type-safe database layer. This document describes all tables, relationships, and constraints.

## Entity Relationship Diagram

```
┌─────────────────┐
│     users       │ ◄─────────────────┐
├─────────────────┤                   │
│ id (PK)         │                   │
│ phone           │                   │
│ role            │                   │
│ language        │                   │
│ name            │                   │
│ email           │                   │
│ createdAt       │                   │
└─────────────────┘                   │
        │                             │
        │ 1:N                         │
        ├──────────────────────┐      │
        ▼                      ▼      │
    ┌─────────────┐    ┌──────────────────┐
    │    farms    │    │  notifications   │
    ├─────────────┤    ├──────────────────┤
    │ id (PK)     │    │ id (PK)          │
    │ userId (FK) │    │ userId (FK)      │
    │ name        │    │ title            │
    │ location    │    │ message          │
    │ area        │    │ type             │
    └─────────────┘    │ read             │
        │              │ createdAt        │
        │ 1:N          └──────────────────┘
        │
        ▼
    ┌──────────────┐
    │    crops     │
    ├──────────────┤
    │ id (PK)      │
    │ farmId (FK)  │
    │ name         │
    │ planted      │
    │ harvested    │
    │ status       │
    └──────────────┘

┌──────────────────┐    ┌─────────────────────┐
│ pest_detections  │◄───┤  crop_images       │
├──────────────────┤    ├─────────────────────┤
│ id (PK)          │    │ id (PK)             │
│ userId (FK)      │    │ detectionId (FK)    │
│ cropId (FK)      │    │ url                 │
│ image            │    │ uploadedAt          │
│ pest_name        │    └─────────────────────┘
│ confidence       │
│ treatments       │
│ createdAt        │
└──────────────────┘

┌─────────────────┐    ┌──────────────────┐
│  advisories     │    │  soil_reports    │
├─────────────────┤    ├──────────────────┤
│ id (PK)         │    │ id (PK)          │
│ userId (FK)     │    │ userId (FK)      │
│ cropId (FK)     │    │ nitrogen         │
│ title           │    │ phosphorus       │
│ content         │    │ potassium        │
│ type            │    │ ph               │
│ aiGenerated     │    │ texture          │
│ createdAt       │    │ createdAt        │
└─────────────────┘    └──────────────────┘

┌───────────────────┐   ┌──────────────────┐
│ market_prices     │   │ weather_logs     │
├───────────────────┤   ├──────────────────┤
│ id (PK)           │   │ id (PK)          │
│ crop              │   │ userId (FK)      │
│ mandi             │   │ temperature      │
│ price             │   │ humidity         │
│ unit              │   │ rainfall         │
│ change_percent    │   │ wind_speed       │
│ updatedAt         │   │ condition        │
└───────────────────┘   │ timestamp        │
                        └──────────────────┘

┌────────────────────┐   ┌──────────────────┐
│ chat_history       │   │ feedback         │
├────────────────────┤   ├──────────────────┤
│ id (PK)            │   │ id (PK)          │
│ userId (FK)        │   │ advisoryId (FK)  │
│ message            │   │ userId (FK)      │
│ response           │   │ rating           │
│ language           │   │ comment          │
│ timestamp          │   │ createdAt        │
└────────────────────┘   └──────────────────┘
```

## Tables

### 1. `users`
Stores farmer, expert, and admin profiles.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  role ENUM('FARMER', 'EXPERT', 'ADMIN') NOT NULL DEFAULT 'FARMER',
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  bio TEXT,
  location GEOGRAPHY(POINT, 4326),
  farm_size_acres DECIMAL(10, 2),
  soil_type VARCHAR(50),
  crops_grown TEXT[],
  years_experience INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users USING GIST(location);
```

---

### 2. `farms`
Farm records linked to farmers.

```sql
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  address TEXT,
  area_acres DECIMAL(10, 2) NOT NULL,
  soil_type VARCHAR(50),
  water_source VARCHAR(100),
  irrigation_method VARCHAR(100),
  soil_ph DECIMAL(3, 1),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_farms_user_id ON farms(user_id);
CREATE INDEX idx_farms_location ON farms USING GIST(location);
```

---

### 3. `crops`
Crops planted on farms.

```sql
CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  planting_date DATE NOT NULL,
  expected_harvest DATE,
  harvested_date DATE,
  status ENUM('PLANNING', 'PLANTING', 'GROWING', 'HARVESTING', 'HARVESTED') DEFAULT 'PLANTING',
  yield_kg DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_crops_farm_id ON crops(farm_id);
CREATE INDEX idx_crops_status ON crops(status);
```

---

### 4. `soil_reports`
Soil analysis and reports.

```sql
CREATE TABLE soil_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id) ON DELETE SET NULL,
  nitrogen_ppm DECIMAL(6, 2),
  phosphorus_ppm DECIMAL(6, 2),
  potassium_ppm DECIMAL(6, 2),
  ph DECIMAL(3, 1),
  texture VARCHAR(50),
  organic_matter_percent DECIMAL(5, 2),
  moisture_percent DECIMAL(5, 2),
  ec_ds_m DECIMAL(6, 2),
  recommendations TEXT,
  lab_name VARCHAR(255),
  sample_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5. `pest_detections`
AI pest and disease detection records.

```sql
CREATE TABLE pest_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  pest_name VARCHAR(255),
  disease_name VARCHAR(255),
  confidence DECIMAL(5, 4),
  symptoms TEXT,
  organic_treatment TEXT,
  chemical_treatment TEXT,
  prevention TEXT,
  severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_pest_detections_user_id ON pest_detections(user_id);
CREATE INDEX idx_pest_detections_crop_id ON pest_detections(crop_id);
CREATE INDEX idx_pest_detections_pest_name ON pest_detections(pest_name);
CREATE INDEX idx_pest_detections_created_at ON pest_detections(created_at);
```

---

### 6. `crop_images`
Images associated with pest detections.

```sql
CREATE TABLE crop_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  detection_id UUID REFERENCES pest_detections(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 7. `advisories`
AI-generated and expert advisories.

```sql
CREATE TABLE advisories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type ENUM('IRRIGATION', 'FERTILIZER', 'PEST', 'DISEASE', 'HARVEST', 'GENERAL') DEFAULT 'GENERAL',
  severity ENUM('INFO', 'WARNING', 'ALERT') DEFAULT 'INFO',
  ai_generated BOOLEAN DEFAULT true,
  created_by_expert_id UUID REFERENCES users(id) ON DELETE SET NULL,
  relevant_until DATE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_advisories_user_id ON advisories(user_id);
CREATE INDEX idx_advisories_crop_id ON advisories(crop_id);
CREATE INDEX idx_advisories_created_at ON advisories(created_at DESC);
```

---

### 8. `weather_logs`
Historical weather data.

```sql
CREATE TABLE weather_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location GEOGRAPHY(POINT, 4326),
  temperature_c DECIMAL(5, 2),
  feels_like_c DECIMAL(5, 2),
  humidity_percent INT,
  rainfall_mm DECIMAL(6, 2),
  wind_speed_kmh DECIMAL(5, 2),
  wind_direction VARCHAR(50),
  atmospheric_pressure_mb INT,
  cloud_cover_percent INT,
  weather_condition VARCHAR(100),
  uv_index DECIMAL(3, 1),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_weather_logs_user_id ON weather_logs(user_id);
CREATE INDEX idx_weather_logs_timestamp ON weather_logs(timestamp DESC);
CREATE INDEX idx_weather_logs_location ON weather_logs USING GIST(location);
```

---

### 9. `market_prices`
Commodity market prices.

```sql
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name VARCHAR(100) NOT NULL,
  mandi_name VARCHAR(255) NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  price_change_percent DECIMAL(6, 3),
  previous_price DECIMAL(10, 2),
  trend VARCHAR(50),
  quality VARCHAR(100),
  supply_volume INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100)
);
```

**Indexes:**
```sql
CREATE INDEX idx_market_prices_crop ON market_prices(crop_name);
CREATE INDEX idx_market_prices_mandi ON market_prices(mandi_name);
CREATE INDEX idx_market_prices_updated_at ON market_prices(updated_at DESC);
```

---

### 10. `notifications`
System and push notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('WEATHER', 'PEST_ALERT', 'MARKET', 'ADVISORY', 'SYSTEM') DEFAULT 'SYSTEM',
  image_url TEXT,
  action_url TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

### 11. `chat_history`
Chatbot conversation logs.

```sql
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  session_id UUID,
  intent VARCHAR(100),
  confidence DECIMAL(3, 2),
  voice_input BOOLEAN DEFAULT false,
  voice_output BOOLEAN DEFAULT false,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Indexes:**
```sql
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX idx_chat_history_timestamp ON chat_history(timestamp DESC);
```

---

### 12. `feedback`
User feedback on advisories and system.

```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  advisory_id UUID REFERENCES advisories(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  helpful BOOLEAN,
  implemented BOOLEAN,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 13. `government_schemes`
Government agriculture schemes information.

```sql
CREATE TABLE government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  eligibility_criteria TEXT,
  benefits TEXT,
  application_url TEXT,
  deadline DATE,
  state_applicable TEXT[],
  crop_applicable TEXT[],
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

### 14. `iot_sensor_logs`
IoT sensor data for smart farming.

```sql
CREATE TABLE iot_sensor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  sensor_id VARCHAR(100),
  sensor_type ENUM('SOIL_MOISTURE', 'TEMPERATURE', 'HUMIDITY', 'LIGHT', 'PH') DEFAULT 'SOIL_MOISTURE',
  value DECIMAL(8, 2),
  unit VARCHAR(20),
  location GEOGRAPHY(POINT, 4326),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 15. `yield_predictions`
ML-based yield predictions.

```sql
CREATE TABLE yield_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id UUID NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
  predicted_yield_kg DECIMAL(10, 2),
  confidence DECIMAL(3, 2),
  factors JSONB,
  model_version VARCHAR(50),
  prediction_date TIMESTAMP,
  actual_yield_kg DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Constraints & Rules

### Foreign Keys
- All foreign keys use CASCADE delete for data cleanup
- Some use SET NULL for historical preservation

### Enums
- `users.role`: FARMER | EXPERT | ADMIN
- `crops.status`: PLANNING | PLANTING | GROWING | HARVESTING | HARVESTED
- `pest_detections.severity`: LOW | MEDIUM | HIGH | CRITICAL
- `advisories.type`: IRRIGATION | FERTILIZER | PEST | DISEASE | HARVEST | GENERAL
- `advisories.severity`: INFO | WARNING | ALERT
- `notifications.type`: WEATHER | PEST_ALERT | MARKET | ADVISORY | SYSTEM

### Geospatial
- `location` fields use PostGIS GEOGRAPHY type for optimal distance queries

## Migrations

Initial migration:

```bash
npx prisma migrate dev --name init
```

---

## Performance Optimization

### Indexes Strategy
- User lookup: `phone`, `role`
- Temporal queries: `created_at DESC` indices
- Geospatial: GIST indices for location-based queries
- Foreign keys: Indexed for JOIN operations

### Partitioning (Future)
For large-scale deployments, consider partitioning:
- `weather_logs` by year/month
- `pest_detections` by created_at
- `market_prices` by crop_name

### Read Replicas
Set up read replicas for analytics queries to avoid impacting transactional database.

---

## Backup Strategy

- Daily automated backups
- Point-in-time recovery enabled
- Weekly full backups to AWS S3
- Monthly cold storage archival

---

## Data Retention

- User data: Retained indefinitely (with anonymization option)
- Chat history: 1 year default
- Weather logs: 2 years
- Market prices: 3 years
- Notifications: 3 months

---

**Last Updated:** May 2026
