# URL Shortener Frontend

## Quick Start

```bash
npm install      # Install dependencies
npm run dev      # Start development server (http://localhost:5173)
```

## Features

### Client Interface (`/`)
- ✅ **URL Shortening** - Clean input with real-time validation
- ✅ **Copy to Clipboard** - One-click copy functionality
- ✅ **Responsive Design** - Mobile and desktop optimized
- ✅ **Blockchain Donations** - Ethereum integration with NFT rewards

### Admin Panel (`/admin`)
- ✅ **JWT Authentication** - Secure login system
- ✅ **URL Management** - Full CRUD operations
- ✅ **Pagination** - 25/50/100 items per page
- ✅ **Sorting** - Click column headers to sort
- ✅ **Real-time Updates** - Live data from backend

### Blockchain Integration
- ✅ **MetaMask Connection** - Web3 wallet integration
- ✅ **Ethereum Donations** - Smart contract interactions
- ✅ **NFT Minting** - Automatic NFT for donations ≥ $100 USD
- ✅ **Transaction Tracking** - Real-time status updates

## Architecture

### Component Structure
```
src/
├── components/
│   ├── Title/           # Main page title with effects
│   ├── UrlBar/          # URL input and shortening logic
│   ├── ShortenedUrl/    # Result display with copy button
│   ├── Login/           # Admin authentication
│   ├── Dashboard/       # URL management table
│   └── DonationModal/   # Blockchain donation interface
├── hooks/
│   └── useWeb3.ts       # Ethereum wallet integration
├── pages/
│   ├── ClientPage.tsx   # Main URL shortener interface
│   └── AdminPage.tsx    # Admin dashboard
└── App.tsx              # Router configuration
```

### Technology Stack
- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Ethers.js** - Ethereum blockchain integration
- **Axios** - HTTP client for API calls

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Required variables:
VITE_API_BASE_URL=http://localhost:8828
```

## API Integration

All components connect to the backend API:
- **URL Shortening**: `POST /shorten`
- **Admin Authentication**: `POST /auth/login`
- **URL Management**: `GET /admin/urls` (with pagination)
- **Donation Tracking**: `POST /donation/track`

## Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Code linting
npm run lint
```

## Browser Support

- **Modern Browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers** - iOS Safari, Chrome Mobile
- **MetaMask Required** - For donation features

## Performance

- **Bundle Size** - Optimized with tree shaking
- **Code Splitting** - Ready for lazy loading
- **Responsive Images** - Optimized for all screen sizes
- **Fast Refresh** - Instant updates during development

## Security

- **Environment Variables** - Sensitive data in .env files
- **Input Sanitization** - XSS protection
- **JWT Tokens** - Secure authentication
- **HTTPS Ready** - Production security headers