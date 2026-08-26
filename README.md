# 🌤️ WeatherWise — Smart Weather & Environment Assistant

> **"WeatherWise doesn't just tell you the weather — it tells you what the weather means for YOU."**

A complete hackathon-ready full-stack web application that delivers **personalized weather insights** based on your lifestyle profile.

---

## ✨ Features

- 🌡️ **Real-time weather** — temperature, humidity, wind, pressure, visibility
- 🌍 **Air quality** — AQI, PM2.5, PM10, ozone, NO₂
- 📅 **7-day forecast** with temperature range bars
- ⏰ **24-hour hourly forecast** with rain probability
- ⚠️ **Smart alerts** — storms, heavy rain, heat, fog, high wind
- 🧠 **Personalized recommendations** for 8 user profiles
- 📍 **Location search** with autocomplete (any city worldwide)
- 📌 **My Location** — one-click GPS detection
- ⭐ **Saved locations** — bookmark your favourite cities
- 📊 **Beautiful charts** — temperature trends & rain probability
- 📱 **Fully responsive** — mobile, tablet, desktop

### 8 User Profiles
| Profile | Focus |
|---|---|
| 🏥 Health | AQI, UV, pollution, wellness |
| 🏃 Fitness | Best workout time, heat/rain warnings |
| ✈️ Travel | Road/travel conditions, packing tips |
| 👨‍👩‍👧 Family | Kids safety, school commute conditions |
| 🌾 Agriculture | Irrigation advice, frost/disease risk |
| 🚗 Commuter | Road conditions, fog/rain/wind advisories |
| 🏄 Beach | Beach conditions, surf, UV protection |
| 🎉 Events | Rain risk, wind, comfort for outdoor events |

---

## 🏗️ Architecture

```
USER BROWSER
     ↓  (React frontend)
REACT FRONTEND (Port 5173)
     ↓  (Axios HTTP calls to /api/...)
FASTAPI BACKEND (Port 8000)
     ↓  (httpx async calls)
OPEN-METEO APIs (free, no key needed)
     ↓  (processed data)
SQLITE DATABASE (local file: weatherwise.db)
     ↓  (JSON response)
REACT DASHBOARD (displays everything)
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + Tailwind CSS v4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Python 3.11 + FastAPI + Uvicorn |
| **Database** | SQLite (via SQLAlchemy) |
| **HTTP Client** | httpx (async) + axios (frontend) |
| **Weather API** | Open-Meteo (FREE, no API key!) |
| **Air Quality API** | Open-Meteo Air Quality (FREE) |
| **Geocoding** | Open-Meteo Geocoding + Nominatim (FREE) |
| **Testing** | pytest (backend) |

> 💡 **No API keys are required!** All APIs used are completely free and open.

---

## 📁 Project Structure

```
smart_weather&Environmental_Assistant/
├── frontend/                  ← React + Vite frontend
│   ├── src/
│   │   ├── components/        ← Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── LocationSearch.jsx
│   │   │   ├── CurrentWeather.jsx
│   │   │   ├── WeatherStats.jsx
│   │   │   ├── AQICard.jsx
│   │   │   ├── Forecast.jsx
│   │   │   ├── HourlyForecast.jsx
│   │   │   ├── WeatherAlerts.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── ProfileSelector.jsx
│   │   │   ├── WeatherChart.jsx
│   │   │   ├── SavedLocations.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  ← Main page
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── weatherApi.js  ← All API calls go here
│   │   ├── hooks/
│   │   │   ├── useWeather.js  ← Weather data hook
│   │   │   └── useLocation.js ← Location detection hook
│   │   ├── utils/
│   │   │   ├── weatherUtils.js
│   │   │   └── recommendationUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          ← Global styles + design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   ← FastAPI backend
│   ├── main.py                ← Entry point
│   ├── routes/
│   │   ├── weather.py         ← /api/weather, /api/forecast, /api/alerts
│   │   ├── air_quality.py     ← /api/air-quality
│   │   ├── recommendations.py ← /api/recommendation
│   │   └── locations.py       ← /api/location/*, /api/saved-locations
│   ├── services/
│   │   ├── weather_service.py
│   │   ├── air_quality_service.py
│   │   └── recommendation_service.py ← The AI engine
│   ├── database/
│   │   ├── database.py
│   │   └── models.py
│   ├── schemas/
│   │   ├── weather_schema.py
│   │   ├── user_schema.py
│   │   └── recommendation_schema.py
│   ├── utils/
│   │   └── weather_utils.py
│   ├── tests/
│   │   └── test_api.py        ← pytest tests
│   ├── requirements.txt
│   ├── .env                   ← Your settings (not committed to git)
│   └── .env.example           ← Template
│
└── README.md                  ← This file!
```

---

## 🚀 Installation & Running

### Prerequisites
- **Python 3.11+** — Download from [python.org](https://www.python.org/downloads/)
- **Node.js 18+** — Download from [nodejs.org](https://nodejs.org/)

### Step 1 — Clone / Open the project
Open the `smart_weather&Environmental_Assistant` folder.

---

### Step 2 — Set up the Backend

Open a terminal (Command Prompt or PowerShell) and run:

```bash
# Navigate to the backend folder
cd backend

# Create a Python virtual environment
# (This keeps all Python packages isolated)
python -m venv venv

# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

# Install all required Python packages
pip install -r requirements.txt

# Copy the environment variables template
copy .env.example .env
# (On Mac/Linux: cp .env.example .env)

# Start the backend server
uvicorn main:app --reload
```

The backend will start at: **http://localhost:8000**
API documentation: **http://localhost:8000/docs**

---

### Step 3 — Set up the Frontend

Open a **new** terminal (keep the backend running):

```bash
# Navigate to the frontend folder
cd frontend

# Install all required Node.js packages
npm install

# Start the frontend development server
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

### Step 4 — Open the App

Open your browser and go to: **http://localhost:5173**

The app will automatically load weather for Hyderabad as the default location.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check if backend is running |
| GET | `/api/weather?latitude=&longitude=&location=` | Current weather + forecast |
| GET | `/api/forecast?latitude=&longitude=` | 7-day forecast |
| GET | `/api/air-quality?latitude=&longitude=` | AQI and pollutants |
| GET | `/api/alerts?latitude=&longitude=` | Weather alerts |
| GET | `/api/recommendation?latitude=&longitude=&profile=` | Personalized recommendation |
| GET | `/api/location/search?query=` | Search city by name |
| GET | `/api/location/reverse?latitude=&longitude=` | Coords → city name |
| GET | `/api/saved-locations/{session_id}` | Get saved locations |
| POST | `/api/saved-locations` | Save a location |
| DELETE | `/api/saved-locations/{id}` | Remove a location |

**Interactive API docs:** http://localhost:8000/docs

---

## 🧪 Running Tests

### Backend Tests (pytest)

```bash
cd backend
.\venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux
pytest tests/ -v
```

This runs all API endpoint tests and checks:
- Health endpoint
- Weather data structure
- Air quality data
- All 8 recommendation profiles
- Location search (valid + invalid)
- Alerts
- Missing/invalid parameters

---

## 🌍 Environment Variables

### Backend (`backend/.env`)
See `backend/.env.example` for the complete template:

```env
PORT=8000
APP_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
DATABASE_URL=sqlite:///./weatherwise.db
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1
OPEN_METEO_AIR_QUALITY_URL=https://air-quality-api.open-meteo.com/v1
OPEN_METEO_GEOCODING_URL=https://geocoding-api.open-meteo.com/v1
```

### Frontend (`frontend/.env`)
See `frontend/.env.example` for the template:

```env
# Leave empty or set to http://localhost:8000 for local dev proxy
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🚢 Deployment Preparation & Commands

### Backend Production Command
Run the backend with Uvicorn bound to `0.0.0.0` using the environment `PORT` (e.g., Render, Railway, Fly.io, Docker):

```bash
# Running from backend directory:
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

# Or directly with Python:
python main.py
```

### Frontend Production Build
```bash
cd frontend
npm run build
```
The production bundle is output to `frontend/dist/`.

---

## 🔧 Troubleshooting

**"Cannot connect to WeatherWise server"**
→ Make sure the backend is running: `uvicorn main:app --reload` in the `backend/` folder.

**"Module not found" errors in Python**
→ Make sure you activated the virtual environment: `.\venv\Scripts\activate`

**Frontend shows blank / not loading**
→ Make sure you ran `npm install` first, then `npm run dev`.

**"No locations found" for a city**
→ Try a different spelling. The geocoding API uses English city names.

**Port 8000 already in use**
→ Change the port: `uvicorn main:app --reload --port 8001`

---

## 🔮 Future Improvements

- [ ] User authentication (login/register)
- [ ] Push notifications for weather alerts
- [ ] Weather radar maps
- [ ] Historical weather data
- [ ] Export weather data as PDF/CSV
- [ ] Multiple languages
- [ ] PostgreSQL support (production-ready)
- [ ] Docker deployment
- [ ] PWA (Progressive Web App) — installable on mobile

---

## 📄 License

MIT License — free to use for educational and hackathon purposes.

---

*Built with ❤️ for a hackathon. Powered by [Open-Meteo](https://open-meteo.com/) — the free weather API.*
