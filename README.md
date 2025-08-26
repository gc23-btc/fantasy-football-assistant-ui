# Fantasy Football Assistant – Web UI

A comprehensive fantasy football management application built with **Next.js 14**, **TypeScript**, and **Tailwind CSS** using the App Router. Features AI-powered lineup advice, real-time data, and advanced analytics.

## 🚀 Features

### Core Features
- **ESPN Integration** - Real-time league and scoreboard data
- **AI-Powered Advice** - Lineup recommendations using Google Gemini
- **Interactive Dashboard** - Modern, responsive UI with dark theme
- **Player Search** - Autocomplete player search functionality
- **Data Visualization** - Performance charts and analytics

### Advanced Features
- **Waiver Wire Recommendations** - Top available players
- **Trade Analyzer** - Evaluate potential trades with AI insights
- **Performance Charts** - Visualize player and team performance
- **Mobile Optimization** - Responsive design for all devices
- **Real-time Updates** - Live scoring and matchup data

### Technical Features
- **TypeScript** - Full type safety throughout the application
- **Error Boundaries** - Graceful error handling
- **Rate Limiting** - API protection and optimization
- **Caching Strategy** - SWR for efficient data fetching
- **Unit Testing** - Comprehensive test coverage
- **CI/CD Pipeline** - Automated testing and deployment

## 🚀 Quick Start

### For End Users (No Setup Required!)
This app is designed to work out of the box! Users just need to:
1. Enter their League ID and Team ID from ESPN Fantasy Football
2. Select the current week and risk preference
3. Get AI-powered lineup advice instantly

### For Developers

#### Prerequisites
- Node.js 18+ 
- npm or pnpm

#### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd fantasy-football-assistant-ui
   npm install
   ```

2. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open** `http://localhost:3000` in your browser

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📁 Project Structure

```
fantasy-football-assistant-ui/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── espn/          # ESPN API endpoints
│   │   ├── lineup/        # AI advice endpoints
│   │   └── health/        # Health check
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # React components
│   ├── data-display/      # Data visualization components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
├── __tests__/            # Test files
└── styles/               # Global styles
```

## 🔧 Configuration

### Environment Variables (For Developers/Deployment)

Create a `.env.local` file with the following variables:

```env
# Required: Google Gemini API for AI advice
GEMINI_API_KEY=your_gemini_api_key_here

# Required: ESPN Fantasy Football API (Server-side only)
ESPN_LEAGUE_ID=your_default_league_id_here
ESPN_SEASON=2025
ESPN_S2=your_espn_s2_cookie_here
ESPN_SWID=your_swid_cookie_here

# Optional: For future features
# DATABASE_URL=your_database_url_here
# REDIS_URL=your_redis_url_here
```

### Getting ESPN Credentials (For Developers)

1. Log into ESPN Fantasy Football
2. Open browser developer tools (F12)
3. Go to Application/Storage → Cookies
4. Copy `espn_s2` and `SWID` values

### For End Users

**No setup required!** Users just need to find their League ID and Team ID from ESPN Fantasy Football URLs:

- **League ID**: Found in the URL when viewing your league: `fantasy.espn.com/football/league?leagueId=123456`
- **Team ID**: Found in the URL when viewing your team: `fantasy.espn.com/football/team?leagueId=123456&teamId=1`

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- Component unit tests
- Hook testing
- API route testing
- Error boundary testing

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main

### Manual Deployment

```bash
npm run build
npm run start
```

## 📊 API Endpoints

### ESPN Data
```bash
# League information
GET /api/espn/league?leagueId=123456

# Weekly scoreboard
GET /api/espn/scoreboard?leagueId=123456&week=1
```

### AI Advice
```bash
# Lineup recommendations
POST /api/lineup/advice
Content-Type: application/json

{
  "roster": [...],
  "opponent": [...],
  "scoring": {...},
  "risk": "balanced"
}
```

### Health Check
```bash
GET /api/health
```

## 🔒 Security & Performance

- **Rate Limiting** - API protection against abuse
- **Error Boundaries** - Graceful error handling
- **Type Safety** - Full TypeScript coverage
- **Caching** - SWR for efficient data fetching
- **Mobile Optimization** - Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for fantasy football enthusiasts**