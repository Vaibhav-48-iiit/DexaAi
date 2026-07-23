# Dexa.AI ✨

Dexa.AI is a highly interactive, futuristic Local AI Assistant built for Windows. It features a JARVIS-inspired, audio-reactive 3D particle orb, real-time Speech-to-Text (STT), and native Windows OS automation. 

Powered entirely by **Ollama (Llama 3.2)** running locally on your machine, Dexa.AI is fast, private, and capable of executing real computer commands (like opening websites, searching files, and launching applications) directly from your voice.

---

## 🌟 Features

- **Audio-Reactive 3D Hologram:** A custom WebGL (Three.js) particle swarm that dynamically scales, pulses, and rotates based on the pitch and volume of your voice.
- **Flawless Voice Recognition:** Real-time Speech-to-Text (STT) with smart debouncing to prevent endless echo loops and race conditions.
- **Local OS Automation:** Dexa can control your PC natively! Ask her to "Open YouTube," "Play Spotify," or "Find my react folder."
- **100% Local Processing:** Uses Ollama as the backend LLM engine, ensuring your data never leaves your computer.

---

## 🚀 Getting Started

Follow these instructions to clone the project, install dependencies, and run Dexa.AI locally on your machine.

### 1. Prerequisites
You will need the following installed on your computer:
* [Node.js](https://nodejs.org/en) (v16 or higher)
* [Git](https://git-scm.com/)
* [Ollama](https://ollama.com/) (Required for the local AI backend)

### 2. Install & Run Ollama
Dexa.AI uses the Llama 3.2 model to process commands. 
1. Download and install **Ollama**.
2. Open your terminal and pull the model by running:
   ```bash
   ollama run llama3.2
   ```
   *(Keep Ollama running in the background while using Dexa.AI).*

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
PORT=port_number
mongodb_uri=your_mongodb_uri
jwt_secret=your_super_secret_jwt_key_here
ollama_Host=http://127.0.0.1:11434
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
* **Backend:** Node.js, Express, MongoDB , Ollama (Llama 3.2), Windows Child Processes
