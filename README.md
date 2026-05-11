# MediAI – Smart Healthcare & Disease Prediction System

<div align="center">
  <h3>🏥 AI-Powered Healthcare Platform</h3>
  <p>A comprehensive full-stack healthcare platform with AI disease prediction, symptom checking, appointment booking, and health management.</p>
</div>

---

## 🚀 Features

### Core Modules
- **AI Symptom Checker** – Select symptoms and get AI-predicted diseases with confidence scores
- **Health Risk Prediction** – ML models for diabetes, heart disease risk assessment
- **Hospital Finder** – Find nearby hospitals with filters and emergency availability
- **Appointment Booking** – Book, cancel, and manage appointments with doctors
- **Digital Health Records** – Upload, organize, and share medical documents
- **AI Healthcare Chatbot** – 24/7 health guidance, diet tips, and wellness support
- **Emergency SOS** – One-tap emergency with location sharing
- **Medicine Reminders** – Set medication schedules with water intake tracking

### Dashboards
- **Patient Dashboard** – Health score, BMI tracker, analytics charts
- **Doctor Dashboard** – Appointment management, patient records, analytics
- **Admin Dashboard** – Platform analytics, user/hospital management, disease stats

### Advanced Features
- 🌗 Dark/Light mode toggle
- 📱 Fully responsive design
- 🔐 JWT authentication with role-based access
- 📊 Interactive charts with Chart.js
- ⚡ Loading skeletons and smooth animations
- 🔍 Search, filtering, and pagination

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Tailwind CSS, Chart.js, React Router |
| **Backend** | Node.js, Express.js, Mongoose |
| **AI Service** | Python Flask, Scikit-learn, NumPy |
| **Database** | MongoDB |
| **Auth** | JWT, bcryptjs |

---

## 📁 Project Structure

```
MediAI/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth & Theme contexts
│   │   ├── layouts/          # Main & Dashboard layouts
│   │   ├── pages/            # All page components
│   │   │   ├── patient/      # Patient dashboard pages
│   │   │   ├── doctor/       # Doctor dashboard pages
│   │   │   └── admin/        # Admin dashboard pages
│   │   ├── services/         # API service (Axios)
│   │   └── main.jsx          # App entry point
│   └── index.html
├── backend/                  # Node.js + Express
│   ├── config/               # DB & service configs
│   ├── controllers/          # Route controllers
│   ├── middleware/            # Auth, error, validation
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── server.js             # Express app entry
│   └── seed.js               # Database seeder
├── ai-service/               # Python Flask ML
│   ├── app.py                # Flask API + ML models
│   └── requirements.txt
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `backend/.env` and update:
```env
MONGODB_URI=mongodb://localhost:27017/mediai
JWT_SECRET=your_secret_key
```

### 3. Seed Database

```bash
cd backend
node seed.js
```

### 4. Start Services

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - AI Service
cd ai-service && python app.py
```

### 5. Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health
- **AI Service**: http://localhost:5001/health



---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get profile |
| GET | /api/auth/doctors | List doctors |
| GET/POST | /api/appointments | Manage appointments |
| GET/POST | /api/hospitals | Manage hospitals |
| GET | /api/hospitals/nearby | Find nearby |
| GET/POST | /api/predictions | AI predictions |
| GET/POST | /api/reports | Health records |
| POST | /api/emergency | Send SOS |
| GET | /api/notifications | Get notifications |
| GET | /api/admin/dashboard | Admin stats |

---

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control (Patient/Doctor/Admin)
- API rate limiting
- Input validation with express-validator
- Helmet.js security headers
- CORS protection

---

## 📝 License

This project is for educational purposes (B.Tech Final Year Project).

Built with ❤️ by MediAI Team
