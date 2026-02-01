# CareerLyzer

AI-Powered Smart Resume Analyzer and Career Suggestion Platform

## Features
- Upload and analyze resumes
- Get AI-powered career recommendations
- Identify skill gaps for your target career
- Generate learning roadmaps

## Tech Stack
- **Frontend:** React, Recharts
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Deployment:** Netlify (Frontend), Render (Backend)

## Setup

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm start
```

## Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend
Add in Netlify:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```
