# CareerLyzer - AI-Powered Smart Resume Analyzer and Career Suggestion Platform

## 🚀 Project Overview

CareerLyzer is a comprehensive MERN stack application that uses AI-powered analysis to help job seekers optimize their resumes and discover suitable career paths. The platform provides intelligent resume scoring, skill extraction, career recommendations, skill gap analysis, and personalized learning roadmaps.

## 📁 Project Structure

```
CareerLyzer 2/
├── backend/                    # Backend server files
│   ├── middleware/            # Authentication middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── uploads/              # File upload directory
│   ├── utils/                # Utility functions
│   ├── server.js             # Main server file
│   ├── seedDatabase.js       # Database seeding
│   ├── package.json          # Backend dependencies
│   └── .env                  # Environment variables
├── client/                    # Frontend React app
│   ├── public/               # Static files
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   └── package.json         # Frontend dependencies
├── package.json              # Root package.json
└── README.md                # Project documentation
```

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "CareerLyzer 2"
```

### 2. Install All Dependencies
```bash
npm run install-deps
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/careerlyzer
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Seed the Database
```bash
npm run seed
```

### 6. Start the Application

#### Development Mode (Recommended)
```bash
npm run dev
```
This starts both backend (port 5000) and frontend (port 3000) simultaneously.

#### Individual Services
```bash
# Start only backend
npm run server

# Start only frontend
npm run client
```

#### Production Mode
```bash
npm run build
npm start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017/careerlyzer

## 📋 Available Scripts

### Root Level Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start backend server only
- `npm run client` - Start frontend development server only
- `npm run build` - Build frontend for production
- `npm start` - Start production server
- `npm run seed` - Seed database with career data
- `npm run install-deps` - Install dependencies for root, backend, and frontend

### Backend Scripts (run from backend/ directory)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database

### Frontend Scripts (run from client/ directory)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## ✨ Features

### 🔹 Core Features
- **AI Resume Analysis**: Upload PDF/text resumes for intelligent parsing and scoring
- **Skill Extraction**: Automatically identify technical skills from resume content
- **Resume Scoring**: ATS-like scoring algorithm (0-100) based on multiple criteria
- **Career Recommendations**: AI-powered career path suggestions based on user skills
- **Skill Gap Analysis**: Identify missing skills for target career paths
- **Learning Roadmaps**: Step-by-step learning paths with resources
- **Progress Tracking**: Track learning progress and completed steps

### 🔹 Technical Features
- **Secure Authentication**: JWT-based user authentication
- **Professional Dashboard**: Modern UI with charts and analytics
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic content updates
- **Data Persistence**: MongoDB for user data and progress tracking

## 🛠️ Technology Stack

### Frontend (client/)
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization and charts
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with professional AI theme

### Backend (backend/)
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### AI & Analysis
- **Natural.js** - Natural language processing
- **PDF-Parse** - PDF text extraction
- **Custom algorithms** - Resume scoring and career matching

### Security & Authentication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in backend/.env file

2. **Port Already in Use**
   - Change PORT in backend/.env file
   - Kill existing processes on port 5000/3000

3. **Dependencies Issues**
   - Run `npm run install-deps` from root directory
   - Delete node_modules and package-lock.json, then reinstall

4. **Resume Upload Fails**
   - Check file size (max 5MB)
   - Ensure file format is PDF or TXT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**CareerLyzer** - Empowering careers through AI-driven insights! 🚀