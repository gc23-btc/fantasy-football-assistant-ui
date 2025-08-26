# Fantasy Football Assistant - Setup Guide

## 🚀 Quick Start for Users

### For General Users (No Setup Required!)
This app is designed to work out of the box! Just enter your League ID and Team ID, and you're ready to go.

### For Developers/Advanced Users

#### 1. Clone and Install
```bash
git clone <repository-url>
cd fantasy-football-assistant-ui
npm install
```

#### 2. Environment Setup (Optional)
Only needed if you want to customize the ESPN credentials or add your own Gemini API key.

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

#### 3. Run the App
```bash
npm run dev
```

## 🔧 Environment Variables (Optional)

### Required for Custom Setup:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `ESPN_S2`: ESPN authentication cookie
- `ESPN_SWID`: ESPN SWID cookie
- `ESPN_SEASON`: NFL season year (default: 2025)

### Getting ESPN Credentials:
1. Log into ESPN Fantasy Football
2. Open browser developer tools (F12)
3. Go to Application/Storage → Cookies
4. Copy `espn_s2` and `SWID` values

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm run start
```

## 📱 Usage

### For End Users:
1. Visit the deployed app
2. Enter your League ID (found in ESPN Fantasy Football URL)
3. Enter your Team ID (found in your team page URL)
4. Select the current week
5. Choose your risk preference
6. Get AI-powered lineup advice!

### League ID Example:
- URL: `https://fantasy.espn.com/football/league?leagueId=123456`
- League ID: `123456`

### Team ID Example:
- URL: `https://fantasy.espn.com/football/team?leagueId=123456&teamId=1`
- Team ID: `1`

## 🆘 Support

- Check the README.md for detailed technical information
- Open an issue on GitHub for bugs or feature requests
- The app includes error handling and helpful error messages

---

**Note**: This app uses server-side ESPN authentication, so users don't need to provide their own credentials!
