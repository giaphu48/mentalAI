# 🧠 mentalAI

> A mental health support chatbot built to help users express emotions, receive empathetic AI responses, and track emotional wellbeing over time.

---

## 🌟 Overview

**mentalAI** is a mental-health-focused chatbot designed to offer users a safe, non-judgmental space for emotional expression and self-reflection.  
It leverages AI and NLP techniques to understand user inputs, detect emotions, and generate contextually appropriate responses — helping users feel heard, supported, and guided.

---

## 🚀 Features

- 💬 **AI-Powered Chat** — Intelligent emotional understanding and natural conversation flow  
- 🧩 **Emotion Recognition** — Detects and adapts responses to user mood  
- 📊 **Conversation Tracking** — Keeps chat history for self-monitoring and analysis  
- 🌙 **Mindfulness & Self-Help Tools** — Suggests relaxation and positive coping methods  
- 🔒 **Privacy-Oriented Design** — No sensitive data is shared externally  

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | TypeScript / JavaScript, React, CSS |
| **Backend** | Node.js / Flask (Python), Express |
| **AI / NLP** | Large Language Models (LLM), Embeddings, Retrieval-Augmented Generation (RAG) |
| **Database (optional)** | MySQL |
| **Dev Tools** | Git, VSCode |

---

## 📁 Project Structure

```
mentalAI/
│
├── FE/                     # Frontend (React)
│   ├── src/
│   ├── public/
│   └── package.json
│   
├── chatbot
│   ├── faiss_vi_db/
│   ├── main.py
│   └── requirement.text 
│   
├── BE/                     # Backend (API)
│   ├── src/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Prerequisites
Before running the project, make sure you have:
- [Node.js](https://nodejs.org/) (v18+)
- [Python 3.11](https://www.python.org/downloads/) 

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/giaphu48/mentalAI.git
cd mentalAI
```

---

### 3️⃣ Setup & Run Frontend

```bash
cd FE
npm install
npm run dev
```

The app will be available at **http://localhost:3000**

---

### 4️⃣ Setup & Run Backend

```bash
cd ../BE
npm install
npm run start

cd ../chatbot
pip install -r requirements.txt
python main.py
```

---

## 🧠 How It Works

1. **User sends a message** — expressing emotion or describing a problem.  
2. **AI model processes it** — using NLP to detect sentiment, emotion, and intent.  
3. **Response generation** — chatbot provides a supportive, empathetic message.  
4. **Conversation storage (optional)** — allows progress tracking over time.  

---

## 🛣️ Roadmap

- [ ] Add Emotion & Sentiment Analysis module  
- [ ] Integrate OpenAI / local LLM models  
- [ ] Improve conversation memory & context handling  
- [ ] Implement multilingual support (English + Vietnamese)  
- [ ] Add mindfulness and guided-breathing sessions  
- [ ] Deploy to cloud with Docker & CI/CD pipeline  

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to improve **mentalAI**, please:
1. Fork the repository  
2. Create a new feature branch (`git checkout -b feature/your-feature`)  
3. Commit your changes (`git commit -m "Add new feature"`)  
4. Push to your fork and open a Pull Request  

---

## ⚠️ Disclaimer

**mentalAI is not a replacement for professional mental health care.**  
If you or someone you know is in crisis or experiencing severe emotional distress, please seek help from licensed professionals or local emergency services immediately.

---

## 📜 License

This project currently does not include a license file.  
If you plan to make it open-source, consider adding a `LICENSE` file (e.g., MIT, Apache 2.0, GPLv3).

---

## 💬 Contact

- **Author:** [@giaphu48](https://github.com/giaphu48)  
- **Repository:** [mentalAI](https://github.com/giaphu48/mentalAI.git)

---

> _Built with ❤️ and curiosity to support mental well-being through AI._
