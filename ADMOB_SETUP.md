# Capacitor + AdMob Setup for SmartMind (Android)

## Prerequisites
- Node.js installed
- Android Studio installed
- A Google AdMob account

## Steps to Build Native Android App with AdMob

### 1. Export & Clone
1. Export this project to GitHub via **Settings → GitHub**
2. Clone the repo locally: `git clone <your-repo-url>`
3. Run `npm install`

### 2. Add Android Platform
```bash
npx cap add android
npx cap update android
```

### 3. Install AdMob Plugin
```bash
npm install @capacitor-community/admob
npx cap sync
```

### 4. Configure AdMob App ID
Edit `android/app/src/main/AndroidManifest.xml` and add inside `<application>`:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-YOUR_ADMOB_APP_ID~YOUR_APP_ID"/>
```

### 5. Replace Test Ad IDs
In `src/lib/adManager.ts`, replace the test ad unit IDs with your real ones:
- `android.banner` → Your banner ad unit ID
- `android.interstitial` → Your interstitial ad unit ID
- `android.rewarded` → Your rewarded ad unit ID
- `android.appOpen` → Your app open ad unit ID

Also update `capacitor.config.json` with your real AdMob App ID.

### 6. Build & Run
```bash
npm run build
npx cap sync
npx cap run android
```

### 7. Production
- Remove `server.url` from `capacitor.config.json` for production builds
- Replace all test ad unit IDs with production ones
- Set `initializeForTesting` to `false`

## Ad Placement Summary
| Ad Type | Placement |
|---------|-----------|
| App Open | On app launch |
| Banner | Home page, Learn page (bottom) |
| Interstitial | After AI content generation |
| Rewarded | Unlock extra AI generations, premium prompts |

## AdMob Policy Reminders
- Don't show interstitials more than once per minute
- Don't show ads on error/loading screens
- Don't incentivize ad clicks
- Label native ads clearly
