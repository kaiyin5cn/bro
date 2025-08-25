# URL Shortener

## Setup Instructions

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Update `.env` with your configuration
5. Start server: `npm start`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Update `.env` with your configuration
5. Start development server: `npm run dev`

### Environment Variables

**Backend (.env)**
- `PORT`: Server port (default: 8828)
- `MONGODB_URI`: MongoDB connection string
- `BASE_URL`: Base URL for shortened links

**Frontend (.env)**
- `VITE_API_BASE_URL`: Backend API URL
- `PORT`: Frontend development server port (default: 5173)