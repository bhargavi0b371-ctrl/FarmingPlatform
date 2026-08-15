# 📱 React Native Mobile App Setup Guide

## Project Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── dashboard/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── FarmScreen.tsx
│   │   │   └── DashboardNavigator.tsx
│   │   ├── advisory/
│   │   │   ├── AdvisoryScreen.tsx
│   │   │   ├── AdvisoryDetailScreen.tsx
│   │   │   └── GenerateAdvisoryScreen.tsx
│   │   ├── pest/
│   │   │   ├── PestDetectionScreen.tsx
│   │   │   ├── CameraScreen.tsx
│   │   │   └── ResultScreen.tsx
│   │   ├── weather/
│   │   │   ├── WeatherScreen.tsx
│   │   │   └── AlertsScreen.tsx
│   │   ├── market/
│   │   │   ├── MarketScreen.tsx
│   │   │   └── PriceDetailScreen.tsx
│   │   ├── chatbot/
│   │   │   ├── ChatScreen.tsx
│   │   │   └── VoiceInputScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── LanguageScreen.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── farm/
│   │   │   ├── FarmCard.tsx
│   │   │   └── FarmForm.tsx
│   │   ├── advisory/
│   │   │   ├── AdvisoryCard.tsx
│   │   │   └── AdvisoryFeedback.tsx
│   │   └── market/
│   │       └── PriceCard.tsx
│   ├── navigation/
│   │   ├── NavigationContainer.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── AppNavigator.tsx
│   │   └── types.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── farmStore.ts
│   │   ├── weatherStore.ts
│   │   └── notificationStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── farm.ts
│   │   ├── pest.ts
│   │   ├── advisory.ts
│   │   ├── weather.ts
│   │   ├── chatbot.ts
│   │   └── notification.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── storage.ts
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   ├── ta.json
│   │   │   └── te.json
│   │   └── i18n.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── farm.ts
│   │   └── advisory.ts
│   └── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── eas.json
└── .env.example
```

## Installation

### Prerequisites
```bash
# Install Node.js 18+
# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for building)
npm install -g eas-cli
```

### Setup Steps

```bash
# 1. Create Expo app
npx create-expo-app EcoFarm
cd EcoFarm

# 2. Install dependencies
npm install \
  react-native \
  react-native-gesture-handler \
  react-native-reanimated \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  @react-navigation/stack \
  zustand \
  axios \
  i18next \
  react-i18next \
  expo-camera \
  expo-image-picker \
  expo-av \
  react-native-svg \
  lottie-react-native \
  react-native-maps

# 3. Install dev dependencies
npm install --save-dev \
  typescript \
  @types/react \
  @types/react-native \
  @types/node \
  jest \
  @testing-library/react-native

# 4. Initialize TypeScript
npx tsc --init

# 5. Configure EAS
eas build:configure
```

### Environment Setup

Create `.env` file:
```env
EXPO_PUBLIC_API_URL=http://your-api.com/api
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_LANGUAGE=en
```

## Key Mobile Screens

### 1. Splash Screen
- App logo and branding
- Check authentication status
- Load initial data
- Show loading animation

### 2. Login Screen
- Phone number input
- OTP verification
- Role selection
- Multilingual support

### 3. Home Dashboard
- Quick stats (farms, crops, alerts)
- Weather widget
- Recent advisories
- Quick action buttons
- Bottom tab navigation

### 4. Pest Detection
- Camera integration
- Image upload
- Loading state with animation
- Result display with confidence
- Treatment recommendations
- Share result option

### 5. Advisory Screen
- Personalized feed
- Filter by crop/type
- Search functionality
- Rate and feedback
- Share advisory

### 6. Weather Screen
- Current conditions (large)
- Hourly forecast
- 7-day forecast
- Alerts section
- Severe weather warnings

### 7. Market Prices
- Crop prices table
- Price trends chart
- Filter by mandi
- Price change indicators
- Historical data

### 8. Chatbot
- Conversational UI
- Voice input button
- Voice output playback
- Language selection
- Chat history
- Low bandwidth mode

### 9. Profile & Settings
- User profile editing
- Language selection
- Notification preferences
- Offline mode
- Dark/Light theme
- Logout

## Development Commands

```bash
# Development
npm start

# Run on Android emulator
npm run android

# Run on iOS simulator
npm run ios

# Run on web
npm run web

# Build APK
eas build --platform android --local

# Build iOS
eas build --platform ios --local

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Test
npm test

# Lint
npm run lint

# Type check
npm run type-check
```

## Key Features for Mobile

### Offline Support
```typescript
// Use AsyncStorage for caching
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getCachedAdvisories() {
  const cached = await AsyncStorage.getItem('advisories');
  return cached ? JSON.parse(cached) : null;
}
```

### Push Notifications
```typescript
// Firebase Cloud Messaging
import messaging from '@react-native-firebase/messaging';

export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  return enabled;
}
```

### Background Tasks
```typescript
// TaskManager for background operations
import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask('WEATHER_UPDATE', async () => {
  try {
    const weather = await fetchWeather();
    await updateWeatherCache(weather);
  } catch (error) {
    console.error(error);
  }
});
```

### Voice Support
```typescript
// Speech recognition and synthesis
import * as Speech from 'expo-speech';
import * as AudioRecord from 'expo-audio';

export async function speakText(text: string, language: string) {
  await Speech.speak(text, { language, rate: 0.9 });
}
```

## Performance Optimization

### Image Optimization
```typescript
import { Image } from 'react-native';

Image.prefetch(imageUrl);  // Pre-cache images

// Use optimized images
<Image
  source={{ uri: imageUrl }}
  style={{ width: 300, height: 300 }}
  onLoad={() => setImageLoaded(true)}
/>
```

### State Management
```typescript
// Use Zustand for efficient state
import create from 'zustand';

interface Store {
  advisories: Advisory[];
  loading: boolean;
  setAdvisories: (advisories: Advisory[]) => void;
}

export const useAdvisoryStore = create<Store>((set) => ({
  advisories: [],
  loading: false,
  setAdvisories: (advisories) => set({ advisories }),
}));
```

### List Rendering
```typescript
// Use FlatList with optimization props
<FlatList
  data={advisories}
  renderItem={({ item }) => <AdvisoryCard advisory={item} />}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  initialNumToRender={10}
  removeClippedSubviews
  updateCellsBatchingPeriod={50}
/>
```

## Testing

```typescript
// __tests__/HomeScreen.test.tsx
import { render, screen } from '@testing-library/react-native';
import HomeScreen from '../screens/dashboard/HomeScreen';

describe('HomeScreen', () => {
  it('renders welcome message', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Welcome to EcoFarm')).toBeOnTheScreen();
  });
});
```

## Build for Production

```bash
# Create production build
eas build --platform android --auto-submit
eas build --platform ios --auto-submit

# Create update
eas update
```

---

**Last Updated:** May 27, 2026
