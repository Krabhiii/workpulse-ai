# WorkPulse AI

WorkPulse AI is an AI-powered workforce productivity and project management platform that helps managers and employees track projects, tasks, worklogs, productivity, risks, and performance through intelligent dashboards and AI insights.

## Features

- Role-based authentication for Manager and Employee
- Project creation and team member management
- Task assignment with status tracking
- Employee worklog submission
- AI-powered productivity confidence scoring
- Fake report risk detection
- Notification system for task and project updates
- Manager and Employee analytics dashboards
- AI-generated weekly reports
- PDF report export
- WorkPulse AI Assistant for project and productivity queries

## Tech Stack

**Frontend**
- React.js
- Redux Toolkit
- Tailwind CSS
- Axios
- Firebase Google Authentication

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST APIs

**AI**
- OpenRouter AI API

## Project Modules

### Manager
- Create and manage projects
- Add team members
- Assign tasks
- Monitor employee performance
- View analytics and reports
- Receive notifications
- Use AI assistant for team insights

### Employee
- View assigned tasks
- Update task status
- Submit worklogs
- Track productivity confidence
- View personal reports and insights
- Receive task notifications

## AI Features

- Worklog analysis
- Productivity confidence score
- Fake report risk detection
- AI weekly report generation
- AI assistant for productivity and project insights

## Installation

Backend Setup
cd server
npm install
npm run dev
Frontend Setup
cd client
npm install
npm run dev
Environment Variables
/////////////////////////////////////////
Create .env files inside client and server folders.

Server .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key

//////////////////////////////////////////
Client .env
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
///////////////////////////////////////////
Future Scope
Real-time socket notifications
Email alerts
Team leaderboard
Calendar and deadline tracking
Advanced PDF reports
Mobile responsive improvements
Deployment on Render

Author
Abhishek Kumar......
