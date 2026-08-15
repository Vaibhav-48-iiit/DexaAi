# Dexa.AI ✨

Dexa.AI is a highly interactive, futuristic Local AI Assistant built for Windows. It features a JARVIS-inspired, audio-reactive 3D particle orb, real-time Speech-to-Text (STT), and native Windows OS automation. 

Powered by **Groq Cloud APIs (Llama 3.3 70B)**, Dexa.AI is blazing-fast and capable of executing real computer commands (like opening websites, searching files, and launching applications) directly from your voice.

---

## 🌟 Features

- **Audio-Reactive 3D Hologram:** A custom WebGL (Three.js) particle swarm that dynamically scales, pulses, and rotates based on the pitch and volume of your voice.
- **Flawless Voice Recognition:** Real-time Speech-to-Text (STT) with smart debouncing to prevent endless echo loops and race conditions.
- **Local OS Automation:** Dexa can control your PC natively! Ask her to "Open YouTube," "Play Spotify," or "Find my react folder."
- **Ultra-Fast Cloud Intelligence:** Uses Groq's LPU inference engine for lightning-fast responses from the massive Llama-3.3-70b model, paired with the browser's native Web Speech API for zero-latency voice interaction.

---

## 🚀 Getting Started

Follow these instructions to clone the project, install dependencies, and run Dexa.AI locally on your machine.

### 1. Prerequisites
You will need the following installed on your computer:
* [Node.js](https://nodejs.org/en) (v16 or higher)
* [Git](https://git-scm.com/)
* A free [Groq API Key](https://console.groq.com/keys) (Required for the AI backend)

### 2. Get a Groq API Key
Dexa.AI uses Groq's blazing-fast Llama 3.3 70B model to process commands.
1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Create a free account (no credit card required).
3. Generate a new API key and save it for step 4.

### 3. Clone the Repository
```bash
git clone https://github.com/your-username/DexaAi.git
cd DexaAi
```

### 4. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd Backend
```
Install the dependencies:
```bash
npm install
```
Create a `.env` file in the `Backend` directory and add the following:
```env
PORT=3000
mongodb_uri=mongodb://localhost:27017/DexaAi
jwt_secret=your_super_secret_jwt_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
```
Start the backend server:
```bash
npm run dev
```

### 5. Setup the Frontend
Open a **second** terminal and navigate to the frontend folder:
```bash
cd Frontend
```
Install the dependencies:
```bash
npm install
```
Start the React development server:
```bash
npm run dev
```

### 6. Wake Up Dexa! 🎙️
1. Open your browser and navigate to `http://localhost:5173` (or the port provided by Vite).
2. Click the **Microphone** button to grant permissions.
3. Say **"Dexa, initialize my setup"** to wake her up!
4. Try giving commands like *"Open YouTube"* or *"Open ChatGPT"*.

---

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS, Three.js (WebGL), Web Audio API
* **Backend:** Node.js, Express, MongoDB, Groq SDK (Llama 3.3 70B), Windows Child Processes
