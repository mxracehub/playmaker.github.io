# Playmakers | Elite Sports Sweepstakes Arena

![Playmakers Hero](https://picsum.photos/seed/playmakers/1200/400)

**Playmakers** is the premier destination for high-stakes, friend-to-friend sports showdowns. Built for the 2026 season, the platform allows fans to challenge their circle across 16 professional sports categories—from the NBA and NFL to elite divisions like UFC, Surfing, and BMX.

## 🏆 The Arena Vision
Experience the next generation of sports sweepstakes. No house odds—just playmaker vs. playmaker. Select your elite roster, set your stakes, and dominate the standings in real-time.

---

## 💰 Economic Engine: The 100:1 Rule
Playmakers operates on a transparent, unified economy designed for both social play and prize-eligible competition.

- **Universal Ratio**: $1.00 USD = 100 Coins.
- **Gold Coins (GC)**: Recreational currency for social play and training.
- **Sweepstakes Coins (SC)**: Prize-eligible currency.
- **The Bridge**: Winning a Gold Coin challenge rewards the victor with **Sweeps Coins**, allowing playmakers to build real-world value through sports knowledge and skill.
- **Stakes Matching**: Opponents must match the exact currency and amount staked by the challenger to enter the showdown.

---

## 🚀 Core Features

### 1. The Global Lobby
- **16 Sports Categories**: Instant filtering across a wide spectrum of professional sports.
- **Dynamic Empty States**: Themed visuals and messaging for every sport, even during roster updates.
- **Elite Athlete Cards**: Focused, high-impact profiles of the world's top playmakers.

### 2. Challenge Launcher
- **Full Configuration**: Select sport, specific event (e.g., Super Bowl LX, World Cup 2026), and your winning pick.
- **Real-Time Prize Math**: Instant USD conversion for all stakes and reward pools.
- **Stakes Matching**: Enforced parity ensures every showdown is a fair fight.

### 3. Admin Control Center (Arena Control)
- **Scoring Center**: A dedicated tab for recording official win counts and results.
- **Official Data Sync**: Simulation of real-time data fetching from professional sports providers.
- **Matchup Management**: Ability to accept "House" challenges, deny invalid matchups, or force games live.

### 4. Playmaker Identity & Vault
- **Arena Persona**: Custom profile pictures, bios, and career win tracking.
- **Bank Exchange**: Seamless SC redemption for real prizes at the 100:1 ratio.
- **Playmaker Vault**: Secure management of GC and SC balances with dollar-first transparency.

---

## 🤖 AI Integration: The Genkit Announcer
Playmakers leverages **Genkit** to drive its high-impact notification system.
- **Arena Alerts**: When a challenge is issued, the AI Announcer composes an "aggressive Vegas-style" notification.
- **Dynamic Messaging**: Emails include specific stakes, event details, and elite competitive terminology to drive engagement.

---

## 🛡️ Security Shield
The arena is protected by a multi-layered security infrastructure:
- **2FA (Two-Factor Authentication)**: Mandatory TOTP (Time-based One-Time Password) for all accounts, utilizing Google Authenticator.
- **Firebase App Check**: Protects against unauthorized API access.
- **reCAPTCHA Enterprise**: Advanced bot detection on Login and Registration flows.
- **Secure Rules**: Granular Firestore and Storage security rules ensuring playmakers can only access their own data.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & ShadCN UI
- **Backend**: Firebase (Auth, Firestore, Storage, App Hosting)
- **Generative AI**: Genkit with Google Gemini 2.5 Flash
- **Icons**: Lucide React

---

## 🏁 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- Firebase Project Credentials

### Installation
1. Clone the repository.
2. Configure your `.env` file with your Firebase and Genkit API keys.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Administrative Access
To access the **Arena Control** center (`/admin`), a user profile must have the `role: 'admin'` field set in the `userProfiles` Firestore collection.

---

*© 2026 Playmakers Arena. All Rights Reserved. Must be 18+ to participate in Sweepstakes. Void where prohibited by law.*
