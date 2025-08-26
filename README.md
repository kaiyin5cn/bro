# URL Shortener

## Quick Setup

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Run setup script: `npm run setup`
3. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Run setup script: `npm run setup`
3. Start development server: `npm run dev`

### Manual Setup (Alternative)

**Backend:**
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Update `.env` with your MongoDB configuration
5. `npm run dev`

**Frontend:**
1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run dev`

### Environment Variables

**Backend (.env)**
- `PORT`: Server port (default: 8828)
- `MONGODB_URI`: MongoDB connection string
- `BASE_URL`: Base URL for shortened links

**Frontend (.env)**
- `VITE_API_BASE_URL`: Backend API URL
- `PORT`: Frontend development server port (default: 5173)