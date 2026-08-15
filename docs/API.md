# 🚀 Complete API Documentation

## Base URL
```
Production: https://api.ecofarm.app/api
Development: http://localhost:3001/api
```

## Authentication
All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer {jwt_token}
```

## Response Format
```json
{
  "success": true,
  "data": {...},
  "error": null,
  "timestamp": "2026-05-27T10:30:00Z"
}
```

---

## 🔐 Authentication Endpoints

### 1. Send OTP
**POST** `/auth/send-otp`

Request:
```json
{
  "phone": "+919876543210",
  "language": "en"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "expiresIn": 600
  }
}
```

---

### 2. Verify OTP
**POST** `/auth/verify-otp`

Request:
```json
{
  "phone": "+919876543210",
  "otp": "123456"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-id",
      "phone": "+919876543210",
      "role": "FARMER",
      "verified": false
    }
  }
}
```

---

### 3. Complete Registration
**POST** `/auth/register`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Farmer Name",
  "language": "hi",
  "farmLocation": "Karnataka, India",
  "farmSizeAcres": 5,
  "soilType": "Black Soil",
  "cropsGrown": ["Rice", "Wheat"]
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "Farmer Name",
    "verified": true
  }
}
```

---

### 4. Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "phone": "+919876543210",
    "role": "FARMER",
    "name": "Farmer Name",
    "language": "hi",
    "farms": [{...}]
  }
}
```

---

## 🌾 Farm Endpoints

### 1. Get All Farms
**GET** `/farms`

Headers: `Authorization: Bearer {token}`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "farm-id",
      "name": "Green Farm",
      "address": "Village, District",
      "areaAcres": 5,
      "soilType": "Black Soil",
      "crops": [...]
    }
  ]
}
```

---

### 2. Create Farm
**POST** `/farms`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "New Farm",
  "address": "Village, District",
  "areaAcres": 3.5,
  "soilType": "Red Soil",
  "waterSource": "Borewell",
  "irrigationMethod": "Drip"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "farm-id",
    "name": "New Farm",
    "userId": "user-id"
  }
}
```

---

### 3. Get Farm Details
**GET** `/farms/{farmId}`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "farm-id",
    "name": "Green Farm",
    "crops": [...],
    "soilReports": [...],
    "iotLogs": [...]
  }
}
```

---

## 🌾 Crop Endpoints

### 1. Get Crops
**GET** `/crops?farmId={farmId}`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "crop-id",
      "name": "Rice",
      "variety": "Basmati",
      "status": "GROWING",
      "plantingDate": "2026-04-15",
      "expectedHarvest": "2026-09-15"
    }
  ]
}
```

---

### 2. Create Crop
**POST** `/crops`

Request:
```json
{
  "farmId": "farm-id",
  "name": "Wheat",
  "variety": "HD2967",
  "plantingDate": "2026-05-01",
  "expectedHarvest": "2026-10-15"
}
```

Response (201):
```json
{
  "success": true,
  "data": {
    "id": "crop-id",
    "name": "Wheat",
    "status": "PLANTING"
  }
}
```

---

## 🚨 Pest Detection Endpoints

### 1. Detect Pest
**POST** `/pest-detection/detect`

Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "imageUrl": "https://...",
  "cropId": "crop-id"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "detection-id",
    "pestName": "Armyworm",
    "confidence": 0.94,
    "severity": "HIGH",
    "symptoms": "Holes in leaves...",
    "organicTreatment": "Neem spray...",
    "chemicalTreatment": "Insecticide spray...",
    "prevention": "Monitor regularly..."
  }
}
```

---

### 2. Get Detection History
**GET** `/pest-detection/history?limit=10`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "detection-id",
      "pestName": "Armyworm",
      "confidence": 0.94,
      "createdAt": "2026-05-20T10:30:00Z"
    }
  ]
}
```

---

## 🎯 Advisory Endpoints

### 1. Get Advisories
**GET** `/advisories?cropId={cropId}&limit=20`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "advisory-id",
      "title": "Irrigation Alert",
      "content": "Reduce irrigation due to expected rainfall",
      "type": "IRRIGATION",
      "severity": "WARNING",
      "aiGenerated": true,
      "createdAt": "2026-05-20T10:00:00Z"
    }
  ]
}
```

---

### 2. Generate AI Advisory
**POST** `/advisories/generate`

Request:
```json
{
  "cropId": "crop-id",
  "context": "FERTILIZER"
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "advisory-id",
    "title": "Fertilizer Recommendation",
    "content": "Based on soil analysis and current growth stage...",
    "type": "FERTILIZER"
  }
}
```

---

### 3. Rate Advisory
**POST** `/advisories/{advisoryId}/feedback`

Request:
```json
{
  "rating": 5,
  "comment": "Very helpful advice",
  "helpful": true,
  "implemented": true
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "feedback-id",
    "rating": 5
  }
}
```

---

## 🌤️ Weather Endpoints

### 1. Get Current Weather
**GET** `/weather/current?lat=12.97&lon=77.59`

Response (200):
```json
{
  "success": true,
  "data": {
    "temperatureC": 28.5,
    "feelsLikeC": 31.2,
    "humidityPercent": 65,
    "rainfallMm": 0,
    "windSpeedKmh": 12.5,
    "weatherCondition": "Partly Cloudy",
    "uvIndex": 8.2
  }
}
```

---

### 2. Get Weather Forecast
**GET** `/weather/forecast?lat=12.97&lon=77.59&days=7`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-05-28",
      "maxTempC": 32,
      "minTempC": 24,
      "condition": "Rainy",
      "rainfallMm": 15
    }
  ]
}
```

---

### 3. Get Weather Alerts
**GET** `/weather/alerts?lat=12.97&lon=77.59`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "title": "Heavy Rain Expected",
      "description": "Moderate to heavy rainfall expected...",
      "severity": "WARNING",
      "startTime": "2026-05-28T18:00:00Z",
      "endTime": "2026-05-29T06:00:00Z"
    }
  ]
}
```

---

## 💹 Market Endpoints

### 1. Get Market Prices
**GET** `/market/prices?crop=Rice&limit=20`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "cropName": "Rice",
      "mandiName": "Pune Mandi",
      "pricePerUnit": 3250,
      "unit": "kg",
      "priceChangePercent": 2.5,
      "trend": "UPWARD",
      "quality": "Grade A",
      "updatedAt": "2026-05-27T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Top Crops
**GET** `/market/top-crops?limit=5`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "crop": "Rice",
      "count": 1250,
      "avgPrice": 3280
    }
  ]
}
```

---

### 3. Get Price Trends
**GET** `/market/trends/{cropName}?days=30`

Response (200):
```json
{
  "success": true,
  "data": {
    "cropName": "Rice",
    "trend": [
      {
        "date": "2026-04-27",
        "price": 3100
      },
      {
        "date": "2026-05-27",
        "price": 3280
      }
    ],
    "avgPrice": 3200,
    "minPrice": 2950,
    "maxPrice": 3450
  }
}
```

---

## 💬 Chatbot Endpoints

### 1. Send Message
**POST** `/chatbot`

Request:
```json
{
  "message": "How often should I water my rice crop?",
  "language": "en",
  "voiceInput": false
}
```

Response (200):
```json
{
  "success": true,
  "data": {
    "response": "Rice requires standing water of 5-7 cm throughout...",
    "intent": "IRRIGATION_QUERY",
    "voiceUrl": "https://audio-url.mp3"
  }
}
```

---

### 2. Get Chat History
**GET** `/chatbot/history?sessionId={sessionId}&limit=20`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "message": "How to prevent pest attacks?",
      "response": "Implement these preventive measures...",
      "timestamp": "2026-05-27T10:00:00Z"
    }
  ]
}
```

---

## 🔔 Notification Endpoints

### 1. Get Notifications
**GET** `/notifications?read=false&limit=20`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "notification-id",
      "title": "Pest Alert",
      "message": "Armyworm detected in nearby areas",
      "type": "PEST_ALERT",
      "read": false,
      "createdAt": "2026-05-27T09:30:00Z"
    }
  ]
}
```

---

### 2. Mark as Read
**PUT** `/notifications/{notificationId}/read`

Response (200):
```json
{
  "success": true,
  "data": {
    "id": "notification-id",
    "read": true
  }
}
```

---

### 3. Get Unread Count
**GET** `/notifications/unread-count`

Response (200):
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## 📊 Admin Endpoints

### 1. Get Users (Admin only)
**GET** `/admin/users?role=FARMER&limit=50`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "user-id",
      "phone": "+919876543210",
      "name": "Farmer Name",
      "role": "FARMER",
      "verified": true,
      "createdAt": "2026-01-15T00:00:00Z"
    }
  ]
}
```

---

### 2. Get Platform Analytics
**GET** `/admin/analytics?period=month`

Response (200):
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalFarms": 1850,
    "totalDetections": 320,
    "avgAdvisoryRating": 4.5,
    "activeUsers24h": 450,
    "topPests": [
      {
        "name": "Armyworm",
        "count": 85
      }
    ]
  }
}
```

---

### 3. Get Pest Heatmap
**GET** `/admin/pest-map?zoom=8`

Response (200):
```json
{
  "success": true,
  "data": {
    "heatmap": [
      {
        "region": "Karnataka",
        "pestCount": 120,
        "topPest": "Armyworm",
        "severity": "HIGH"
      }
    ]
  }
}
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "error": "Invalid phone number format"
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "error": "Token expired. Please login again."
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "error": "Admin access required"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "error": "Farm not found"
}
```

### 429 - Rate Limited
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

### 500 - Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Auth endpoints**: 5 requests per minute per phone
- **General endpoints**: 100 requests per minute per user
- **Admin endpoints**: 30 requests per minute per admin
- **Pest detection**: 10 requests per day per farmer

---

## Pagination

All list endpoints support pagination:
```
GET /advisories?page=1&limit=20&sort=-createdAt
```

Response includes:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

**Last Updated:** May 27, 2026
