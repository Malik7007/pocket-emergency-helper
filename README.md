# 🛡️ Pocket Helper - Offline Emergency & Safety Assistant

**Pocket Helper** is a premium, offline-first mobile application designed to provide critical safety information and emergency tools in environments with limited connectivity. Optimized for travelers, pilgrims (Hajj & Umrah), and everyday emergency preparedness.

---

## ✨ Key Features

- **🚀 Instant SOS:** Quick-action buttons to send emergency location-based SMS to pre-set contacts.
- **🗺️ Offline POI Map:** Pre-loaded emergency hubs including hospitals, police stations, and fire departments.
- **📚 Safety Guides:** Comprehensive, step-by-step first aid and emergency instructions (CPR, Bleeding, Fire Safety, etc.).
- **🛠️ Utility Toolbox:** Essential tools including a Ritual Counter, Flashlight, Compass, Whistle, and Bubble Level.
- **🌍 Multi-Language Support:** Full localization for **English, Arabic (العربية), Urdu (اردو), Hindi (हिन्दी), and Bengali (বাংলা)**.
- **🎨 Custom Themes:** Multiple aesthetic options including Dark, Light, Gold, Cyber, and Ladies' themes.
- **🎖️ Gamification:** Earn badges and points by completing safety checklists and guides.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + Vite
- **Styling:** CSS3 (Custom Design System)
- **Icons:** Lucide React
- **Mobile Framework:** Capacitor (Native Android Integration)
- **Testing:** Playwright (E2E) & Vitest (Unit)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Android Studio](https://developer.android.com/studio) (for mobile builds)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Malik7007/pocket-emergency-helper.git
   cd pocket-emergency-helper
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run Web Development Server:**
   ```bash
   npm run dev
   ```

### Mobile Build (Android)

1. **Sync Capacitor:**
   ```bash
   npx cap sync
   ```

2. **Build Release APK:**
   ```bash
   cd android
   .\gradlew assembleRelease
   ```

---

## 🧪 Testing

The project includes a robust testing suite:

- **E2E Tests:** `npx playwright test`
- **Unit Tests:** `npm test`

---

## 📄 Privacy Policy

We value your privacy. This app is **offline-first** and does not transmit data to any external servers. Location data is used only to generate SOS messages on-device.

For the full policy, visit: [Privacy Policy](./privacy-policy/index.md)

---

## 👨‍💻 Developer Information

- **Lead Developer:** Arfan Malik
- **Organization:** Ar-Ra Solutions Innovation
- **Contact:** [innovation@ar-ra.solutions](mailto:innovation@ar-ra.solutions)

---

© 2026 Ar-Ra Solutions Innovation. All Rights Reserved.
