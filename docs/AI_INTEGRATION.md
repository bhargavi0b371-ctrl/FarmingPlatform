# 🤖 AI/ML Integration Guide

## 1. Pest Detection System

### Model Options

#### Option A: TensorFlow.js (Browser-based)
**Pros**: Real-time, offline support
**Cons**: Limited accuracy, model size

```typescript
// Load model
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow/tfjs-models/dist/mobilenet';

const model = await mobilenet.load();
const prediction = await model.classify(imageElement);
```

#### Option B: Custom PyTorch Model (Server-side)
**Pros**: 92%+ accuracy, state-of-the-art
**Cons**: Server resource intensive

```python
import torch
from torchvision import models

model = models.resnet50(pretrained=True)
# Train on Indian crop pest dataset
# Deploy as REST API using Flask
```

#### Option C: Cloud Vision API
**Pros**: Managed service, high accuracy
**Cons**: Cost per request, latency

```typescript
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

const request = {
  image: { content: imageBuffer },
};

const [result] = await client.labelDetection(request);
```

### Implementation - Node.js Backend

```typescript
// backend/src/ai/pestDetection.ts
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

export class PestDetectionService {
  private model: tf.LayersModel | null = null;

  async loadModel(modelPath: string) {
    this.model = await tf.loadLayersModel(`file://${modelPath}`);
  }

  async detectPest(imageBuffer: Buffer): Promise<{
    pestName: string;
    confidence: number;
    symptoms: string;
    treatment: Record<string, string>;
  }> {
    if (!this.model) throw new Error('Model not loaded');

    // Preprocess image
    const tensor = tf.node.decodeImage(imageBuffer, 3)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims(0);

    // Predict
    const predictions = this.model.predict(tensor) as tf.Tensor;
    const data = await predictions.data();
    
    // Get top prediction
    const maxIndex = Array.from(data).indexOf(Math.max(...Array.from(data)));
    const pestDatabase = this.getPestDatabase();
    
    tensor.dispose();
    predictions.dispose();

    return {
      pestName: pestDatabase[maxIndex].name,
      confidence: Math.max(...Array.from(data)),
      symptoms: pestDatabase[maxIndex].symptoms,
      treatment: pestDatabase[maxIndex].treatment
    };
  }

  private getPestDatabase() {
    return [
      {
        name: 'Armyworm',
        symptoms: 'Holes in leaves, defoliation',
        treatment: {
          organic: 'Neem spray (3%) - 15 mL per liter',
          chemical: 'Spinosad 45% SC - 0.5 mL per liter'
        }
      },
      {
        name: 'Leaf Folder',
        symptoms: 'Rolled leaves, white dots',
        treatment: {
          organic: 'Bacillus thuringiensis - 1g per liter',
          chemical: 'Chlorpyrifos 20% EC - 2.5 mL per liter'
        }
      },
      // Add 50+ more pest types
    ];
  }
}
```

---

## 2. Advisory Generation using LLM

### Using OpenAI GPT-4

```typescript
// backend/src/ai/advisoryGenerator.ts
import { OpenAI } from 'openai';

export class AdvisoryGeneratorService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateAdvisory(context: {
    cropName: string;
    soilType: string;
    region: string;
    season: string;
    weather: any;
    recentAdvisories: string[];
  }): Promise<{
    title: string;
    content: string;
    type: string;
    severity: string;
  }> {
    const prompt = `
You are an expert agricultural advisor. Based on the following context, provide specific, actionable farming advice:

Crop: ${context.cropName}
Soil Type: ${context.soilType}
Region: ${context.region}
Current Season: ${context.season}
Weather: Temperature ${context.weather.temp}°C, Humidity ${context.weather.humidity}%

Recent advisories given: ${context.recentAdvisories.join(', ')}

Provide:
1. Title (max 50 chars)
2. Detailed advisory (200-300 words)
3. Type (IRRIGATION, FERTILIZER, PEST, DISEASE, HARVEST, GENERAL)
4. Severity (INFO, WARNING, ALERT)

Format as JSON.
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  }
}
```

### Using Google Gemini

```typescript
// backend/src/ai/geminiAdvisor.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiAdvisoryService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateAdvisory(farmerData: any, weatherData: any) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Agricultural Advisor AI

    Farmer Profile:
    - Crop: ${farmerData.crop}
    - Farm Size: ${farmerData.farmSize} acres
    - Region: ${farmerData.region}
    - Soil: ${farmerData.soilType}

    Current Conditions:
    - Temperature: ${weatherData.temp}°C
    - Rainfall: ${weatherData.rainfall}mm
    - Humidity: ${weatherData.humidity}%

    Provide crop management advice in JSON format with:
    {
      "title": "...",
      "advice": "...",
      "priority": "HIGH/MEDIUM/LOW",
      "action": "..."
    }
    `;

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  }
}
```

---

## 3. Voice Chatbot with LangChain

```typescript
// backend/src/ai/voiceChatbot.ts
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';

export class VoiceChatbotService {
  private chain: LLMChain;

  constructor(apiKey: string) {
    const llm = new OpenAI({ temperature: 0.7, openAIApiKey: apiKey });

    const prompt = new PromptTemplate({
      template: `You are a helpful agricultural chatbot speaking to an Indian farmer.
Use simple language. Current context: {context}
Farmer question: {question}
Respond in {language} with practical advice.`,
      inputVariables: ['context', 'question', 'language'],
    });

    this.chain = new LLMChain({ llm, prompt });
  }

  async chat(
    question: string,
    language: 'en' | 'hi' | 'ta' | 'te',
    context: any
  ): Promise<string> {
    const response = await this.chain.call({
      question,
      language: this.getLanguageName(language),
      context: this.buildContext(context),
    });

    return response.text;
  }

  private buildContext(farmData: any): string {
    return `
    Farmer: ${farmData.name}
    Crop: ${farmData.currentCrop}
    Season: ${farmData.season}
    Last Pest Alert: ${farmData.lastPestAlert}
    `;
  }

  private getLanguageName(code: string): string {
    const map: Record<string, string> = {
      en: 'English',
      hi: 'Hindi',
      ta: 'Tamil',
      te: 'Telugu',
    };
    return map[code] || 'English';
  }
}
```

---

## 4. Yield Prediction Model

```python
# backend/ai/yield_prediction.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle

class YieldPredictionModel:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
    
    def train(self, training_data):
        """
        Training data format:
        {
            'rainfall': [mm],
            'temperature': [°C],
            'humidity': [%],
            'nitrogen': [ppm],
            'phosphorus': [ppm],
            'potassium': [ppm],
            'yield': [kg/hectare]
        }
        """
        X = training_data.drop('yield', axis=1)
        y = training_data['yield']
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
    
    def predict(self, farm_data):
        """Predict yield for given conditions"""
        X = pd.DataFrame([farm_data])
        X_scaled = self.scaler.transform(X)
        
        prediction = self.model.predict(X_scaled)[0]
        confidence = self._get_confidence(X_scaled)
        
        return {
            'predicted_yield_kg': float(prediction),
            'confidence': confidence,
            'factors': self._get_feature_importance(X.columns)
        }
    
    def _get_feature_importance(self, features):
        importances = self.model.feature_importances_
        return {
            features[i]: float(importances[i]) 
            for i in range(len(features))
        }
    
    def save(self, path):
        with open(path, 'wb') as f:
            pickle.dump((self.model, self.scaler), f)
```

---

## 5. Integration in Backend Controller

```typescript
// backend/src/controllers/advisoryController.ts
import { Request, Response } from 'express';
import { PestDetectionService } from '../ai/pestDetection';
import { AdvisoryGeneratorService } from '../ai/advisoryGenerator';

export const generateAdvisory = async (req: Request, res: Response) => {
  try {
    const { cropId } = req.body;
    const userId = (req as any).userId;

    // Fetch context
    const crop = await prisma.crop.findUnique({ where: { id: cropId } });
    const farm = await prisma.farm.findUnique({ where: { id: crop?.farmId } });
    const weather = await getLatestWeather(farm?.location);
    const soilReport = await prisma.soilReport.findFirst({
      where: { cropId },
      orderBy: { createdAt: 'desc' }
    });

    // Generate advisory
    const advisoryService = new AdvisoryGeneratorService(process.env.OPENAI_API_KEY!);
    const advisory = await advisoryService.generateAdvisory({
      cropName: crop!.name,
      soilType: soilReport?.texture || 'Unknown',
      region: farm?.address || '',
      season: getCurrentSeason(),
      weather,
      recentAdvisories: []
    });

    // Save to database
    const saved = await prisma.advisory.create({
      data: {
        userId,
        cropId,
        title: advisory.title,
        content: advisory.content,
        type: advisory.type as any,
        severity: advisory.severity as any,
        aiGenerated: true
      }
    });

    res.json({ success: true, data: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
```

---

## 6. Model Training Pipeline

```bash
#!/bin/bash
# backend/scripts/train_pest_detection.sh

echo "Starting pest detection model training..."

# Download dataset
wget https://download.tensorflow.org/datasets/plant_diseases.zip
unzip plant_diseases.zip

# Train model
python backend/ai/train_pest_model.py \
  --dataset plant_diseases \
  --epochs 100 \
  --batch_size 32 \
  --output backend/models/pest_detection_v1.0.h5

# Convert to TFLite
python backend/ai/convert_model.py \
  --input backend/models/pest_detection_v1.0.h5 \
  --output backend/models/pest_detection_v1.0.tflite

echo "Training complete!"
```

---

## 7. API Rate Limiting for AI Services

```typescript
// backend/src/middleware/aiRateLimiter.ts
import rateLimit from 'express-rate-limit';

export const pestDetectionLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 requests per day per farmer
  message: 'Too many pest detections. Please try again tomorrow.'
});

export const advisoryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 advisories per hour
  message: 'Rate limited. Please wait before requesting another advisory.'
});
```

---

## 8. Monitoring AI Model Performance

```typescript
// backend/src/services/aiMonitoring.ts
export class AIMonitoringService {
  async logPrediction(prediction: any, actual?: any) {
    await prisma.aiPredictionLog.create({
      data: {
        modelType: prediction.type,
        confidence: prediction.confidence,
        input: JSON.stringify(prediction.input),
        output: JSON.stringify(prediction.output),
        actualOutcome: actual,
        accuracy: this.calculateAccuracy(prediction, actual),
        timestamp: new Date()
      }
    });
  }

  async getModelMetrics(modelType: string) {
    const logs = await prisma.aiPredictionLog.findMany({
      where: { modelType }
    });

    return {
      totalPredictions: logs.length,
      averageConfidence: logs.reduce((sum, l) => sum + l.confidence, 0) / logs.length,
      accuracy: logs.reduce((sum, l) => sum + (l.accuracy || 0), 0) / logs.length
    };
  }
}
```

---

## 9. Cost Optimization

### API Call Caching
```typescript
import Redis from 'redis';

const redis = Redis.createClient();

export async function getCachedAdvice(farmId: string, cacheKey: string) {
  const cached = await redis.get(`advice:${cacheKey}`);
  if (cached) return JSON.parse(cached);

  // Generate new advice
  const advice = await generateAdvice();
  
  // Cache for 24 hours
  await redis.setex(`advice:${cacheKey}`, 86400, JSON.stringify(advice));
  
  return advice;
}
```

### Batch Processing
```typescript
// Process pest detections in batches during off-peak hours
export async function batchProcessDetections() {
  const pending = await prisma.pestDetection.findMany({
    where: { processed: false },
    take: 100
  });

  for (const detection of pending) {
    await processDetection(detection);
  }
}
```

---

## 10. Testing AI Models

```typescript
// backend/tests/ai.test.ts
import { describe, it, expect } from '@jest/globals';
import { PestDetectionService } from '../src/ai/pestDetection';

describe('Pest Detection AI', () => {
  let service: PestDetectionService;

  beforeAll(async () => {
    service = new PestDetectionService();
    await service.loadModel('./models/pest_detection_v1.0.tflite');
  });

  it('should detect armyworm with >90% confidence', async () => {
    const imageBuffer = fs.readFileSync('./test/fixtures/armyworm.jpg');
    const result = await service.detectPest(imageBuffer);

    expect(result.pestName).toBe('Armyworm');
    expect(result.confidence).toBeGreaterThan(0.9);
  });

  it('should return treatment recommendations', async () => {
    const imageBuffer = fs.readFileSync('./test/fixtures/armyworm.jpg');
    const result = await service.detectPest(imageBuffer);

    expect(result.treatment.organic).toBeDefined();
    expect(result.treatment.chemical).toBeDefined();
  });
});
```

---

**Last Updated:** May 27, 2026
