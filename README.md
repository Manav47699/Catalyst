# 🚀 Catalyst

**The ultimate launchpad for young entrepreneurs.** Catalyst is a platform designed for young entrepreneurs to grow their ventures, improve their networking with like-minded individuals, and access personalized mentorship—both human-driven and AI-powered. 

---

## 🛠️ Tech Stack

Catalyst leverages a robust, modern stack to ensure speed, security, and intelligence.

| Category          | Technologies                                                                                                                                      |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend** | ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white) |
| **Backend** | ![Django](https://img.shields.io/badge/django-%23092e20.svg?style=for-the-badge&logo=django&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) |
| **AI / ML** | ![Ollama](https://img.shields.io/badge/Ollama-black?style=for-the-badge) **Llama 3.2 (3B)**, **Qwen 1.5**, **LangChain**, **OpenAI Whisper** |
| **Geospatial** | **GeoPy**, **OpenStreetMaps** |
| **Payments** | ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white)                                               |

---

## ✨ Key Features

### 🤝 Catalyst Community
A social hub where the "grind" is understood and celebrated.
* **Your feed:** You can post your startup ideas, milestones or announcement for the Catalyst Community to see.
* **Interest Groups:** Create or join specialized circles based on your industry or niche.

### 📍 Catalytic Partners
 Catalyst utilizes **GeoPy** to convert city names into coordinates for mapping. By avoiding real-time GPS tracking and pinpointing only city-level data, we facilitate local connections while prioritizing user security and privacy.

### 💰 Catalytic Finances

* **Expert Mentorship:** A curated marketplace for freelance mentors. After a thorough background and certification check, specialists are listed for hire, with secure payments powered by **Stripe**.
* **Investment Portal:** Startups looking for seed capital can list their ventures and offer investor benefits, gaining visibility with potential backers looking for the next big thing.

---

## 🤖 AI Features

Catalyst integrates local LLMs via **Ollama** to provide a private and powerful user experience.

* **Finetuned AI Mentor:** Driven by **Llama 3.2 (3B Instruct)**, this isn't a generic chatbot. It acts as a true business partner, asking deep follow-up questions to understand your specific business model rather than giving surface-level advice.
* **RAG-Powered Support:** A **Qwen 1.5** based chatbot (using **LangChain**) is accessible on every page to answer platform-specific queries instantly.
* **Voice Integration:** Includes **OpenAI Whisper** for Speech-to-Text, allowing founders to brainstorm and query the AI hands-free.

---

## 📸 Screenshots

### **Catalyst Community**
<div align="center">
  <img width="32%" alt="Community 1" src="https://github.com/user-attachments/assets/8bb50866-2638-426f-a4aa-833e44bc1c97" />
  <img width="32%" alt="Community 2" src="https://github.com/user-attachments/assets/8533f608-2238-407f-9908-beb5a94fad85" />
  <img width="32%" alt="Community 3" src="https://github.com/user-attachments/assets/7c80de36-5e35-4732-9495-86edeea6f306" />
</div>

### **Networking**
<div align="center">
  <img width="49%" alt="Map Partners" src="https://github.com/user-attachments/assets/3f0384b4-693e-47d9-aead-3b2d8ab3a5cd" />
 
</div>

### **Finance**
<div align="center">
  <img width="49%" alt="Finances" src="https://github.com/user-attachments/assets/194e9e5b-4ddf-477c-b8fd-7ee0c59c056e" />
  <img width="49%" alt="Mentors" src="https://github.com/user-attachments/assets/8b127f56-6771-45a1-9f0a-92e50dfd7e07"
  <!-- <img width="40%" alt="AI Chatbot" src="https://github.com/user-attachments/assets/9171995c-fb6f-4f1c-a378-521763e257e1" /> -->
</div>

### **AI Features**
<div align="center">
<img width="40%" alt="AI Chatbot" src="https://github.com/user-attachments/assets/9171995c-fb6f-4f1c-a378-521763e257e1" />
<img width="40%" alt="Screenshot from 2026-01-13 17-58-59" src="https://github.com/user-attachments/assets/5ce58106-f0ba-4482-9950-df3b15b20106" />
  
  
</div>

---

## 🏗️ Getting Started

### Prerequisites
- **Ollama** installed and running.
- **Python 3.10+** and **Node.js 18+**.

### Setup
1.  **Clone the Repo:**
    ```bash
    git clone [https://github.com/your-username/catalyst.git](https://github.com/your-username/catalyst.git)
    ```
2.  **Pull AI Models:**
    ```bash
    ollama pull qwen:1.5
    ollama pull llama3.2:3b
    ```
3.  **Install Frontend:**
    ```bash
    cd frontend && npm install && npm run dev
    ```
4.  **Install Backend:**
    ```bash
    cd backend && pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```

---

## Made by team Fully Stacked

