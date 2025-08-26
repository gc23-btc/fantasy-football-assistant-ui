# Deployment Checklist for Vercel

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] Get your Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Get ESPN credentials (ESPN_S2 and ESPN_SWID cookies)
- [ ] Set ESPN_SEASON (default: 2025)

### 2. Vercel Environment Variables
In your Vercel project settings, add these environment variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
ESPN_S2=your_espn_s2_cookie_here
ESPN_SWID=your_swid_cookie_here
ESPN_SEASON=2025
ESPN_LEAGUE_ID=your_default_league_id_here (optional)
```

### 3. GitHub Repository
- [ ] Push all changes to GitHub
- [ ] Ensure main branch is up to date
- [ ] Verify all files are committed

## 🚀 Deployment Steps

### Option 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔧 Post-Deployment

### 1. Test the Application
- [ ] Visit your deployed URL
- [ ] Test with a sample League ID and Team ID
- [ ] Verify all features work (league data, scoreboard, AI advice)
- [ ] Test error handling

### 2. Monitor
- [ ] Check Vercel function logs
- [ ] Monitor API usage
- [ ] Set up alerts if needed

### 3. Share
- [ ] Share the URL with users
- [ ] Update documentation if needed
- [ ] Consider adding analytics

## 🆘 Troubleshooting

### Common Issues:
1. **Build fails**: Check for TypeScript errors
2. **API errors**: Verify environment variables are set correctly
3. **ESPN auth fails**: Check if cookies are still valid
4. **Gemini API errors**: Verify API key and quota

### Debug Commands:
```bash
# Local build test
npm run build

# Local development
npm run dev

# Check environment variables
echo $GEMINI_API_KEY
```

## �� Performance Optimization

### Vercel Settings:
- Enable Edge Functions for faster API responses
- Set appropriate cache headers
- Monitor function execution time

### Cost Optimization:
- Monitor API usage (Gemini API has costs)
- Set up usage alerts
- Consider caching strategies

---

**Ready for deployment!** 🚀
