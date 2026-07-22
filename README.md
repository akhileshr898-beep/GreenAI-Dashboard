# 🌱 GreenAI Dashboard

An AI Sustainability Analytics Platform that helps users evaluate and compare AI models based on their energy consumption, carbon emissions, memory usage, accuracy, and overall Green Score.

🔗 **Live Demo:** https://YOUR-VERCEL-URL.vercel.app

---

## 📖 Overview

GreenAI Dashboard is a full-stack web application designed to promote sustainable AI usage. It provides insights into the environmental impact of popular AI models and recommends models based on different AI tasks.

The application combines a Flask REST API with an interactive JavaScript dashboard to visualize sustainability metrics in an easy-to-understand format.

---

## ✨ Features

- 🌍 AI Carbon Footprint Calculator
- ⚡ Energy Consumption Analysis
- 🏆 Green AI Leaderboard
- 📊 Interactive Charts using Chart.js
- 🤖 AI Model Recommendation Engine
- 💰 Estimated Electricity Cost Calculator
- 🌎 Country-wise Carbon Emission Factors
- ⚙️ Energy Source Comparison
- 📱 Responsive User Interface
- 🚀 Deployed on Vercel

---

## 📸 Screenshots

> Add screenshots of your application here.

Example:

- Dashboard
- Leaderboard
- Charts
- AI Recommendation

---

## 🛠 Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript
- Chart.js

### Backend

- Python
- Flask
- Flask-CORS

### Deployment

- Git
- GitHub
- Vercel

---

## 📂 Project Structure

```text
GreenAI-Dashboard
│
├── api
│   └── index.py
│
├── public
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── requirements.txt
├── vercel.json
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/GreenAI-Dashboard.git
```

### Navigate to Project

```bash
cd GreenAI-Dashboard
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Environment

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Flask Server

```bash
python api/index.py
```

Open:

```
http://127.0.0.1:5000
```

---

## 📊 Green Score Calculation

The Green Score is calculated using estimated carbon emissions.

```
Green Score = max(10, 100 − Carbon Emissions / 20)
```

Higher Green Score indicates a more sustainable AI model.

---

## 🤖 Supported AI Models

- GPT-4
- GPT-4o
- Llama 3 8B
- Mistral 7B
- Gemma 2B
- Phi-3 Mini

---

## 🌎 Sustainability Factors

The application considers:

- Country-specific carbon intensity
- Energy source
- AI model energy consumption
- Carbon emissions
- Memory usage
- Accuracy

---

## 📈 Future Improvements

- User Authentication
- Database Integration
- Live Carbon Intensity APIs
- Historical Analytics
- Machine Learning Prediction
- Export Reports (PDF/CSV)
- Dark Mode
- Multi-language Support

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Akhilesh Rai**

GitHub: https://github.com/akhileshr898-beep

LinkedIn: YOUR_LINKEDIN_PROFILE

---

⭐ If you found this project useful, consider giving it a star!
