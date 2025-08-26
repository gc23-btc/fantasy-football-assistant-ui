# Fantasy Football MVP Manager

A comprehensive fantasy football management application that allows users to manage multiple ESPN fantasy football teams in one place with AI-powered advice.

## 🚀 Features

### Core Features
- **Multi-Team Management** - Manage all your ESPN fantasy football teams from one dashboard
- **User Authentication** - Secure sign up/login system with user accounts
- **ESPN Integration** - Real-time league and scoreboard data from ESPN
- **AI-Powered Advice** - Lineup recommendations using Google Gemini
- **Team Import** - Easy team connection with ESPN League ID and Team ID
- **Modern Dashboard** - Clean, responsive UI for managing multiple teams

### Advanced Features
- **Team Overview** - View all your teams at a glance
- **Individual Team Pages** - Detailed views for each team
- **AI Lineup Advice** - Get personalized recommendations for each team
- **Performance Tracking** - Monitor your teams' performance
- **Mobile Optimization** - Responsive design for all devices

### Technical Features
- **Next.js 14** - Modern React framework with App Router
- **TypeScript** - Full type safety throughout the application
- **Prisma ORM** - Database management with SQLite
- **NextAuth.js** - Secure authentication system
- **Tailwind CSS** - Modern, responsive styling
- **ESPN API Integration** - Real-time fantasy football data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd fantasy-football-mvp-manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open** `http://localhost:3000` in your browser

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google Gemini API for AI advice
GEMINI_API_KEY="your_gemini_api_key_here"

# ESPN Fantasy Football API (Server-side only)
ESPN_LEAGUE_ID="your_default_league_id_here"
ESPN_SEASON=2024
ESPN_S2="your_espn_s2_cookie_here"
ESPN_SWID="your_swid_cookie_here"
```

## 📁 Project Structure

```
fantasy-football-mvp-manager/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── espn/          # ESPN API endpoints
│   │   ├── teams/         # Team management endpoints
│   │   └── lineup/        # AI advice endpoints
│   ├── auth/              # Authentication pages
│   ├── teams/             # Team management pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── types/                # TypeScript type definitions
```

## 🔧 Database Schema

The application uses Prisma with the following models:

- **User** - User accounts with authentication
- **FantasyTeam** - User's fantasy football teams
- **LineupRecommendation** - AI-generated lineup advice

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Teams
- `GET /api/teams` - Fetch user's teams
- `POST /api/teams` - Add new team

### ESPN Data
- `GET /api/espn/league` - League information
- `GET /api/espn/scoreboard` - Weekly scoreboard

### AI Advice
- `POST /api/lineup/advice` - Get lineup recommendations

## 🔒 Security & Performance

- **Authentication** - Secure user authentication with NextAuth.js
- **Password Hashing** - Bcrypt for secure password storage
- **Rate Limiting** - API protection against abuse
- **Type Safety** - Full TypeScript coverage
- **Database Security** - Prisma ORM with parameterized queries

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for fantasy football enthusiasts who manage multiple teams**