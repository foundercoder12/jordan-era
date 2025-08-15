# 🚀 Deploy Your Motivational Bot

## 🎯 **Deploy to Railway (Recommended)**

### **Step 1: Prepare Your Code**
1. **Commit your changes** to Git:
   ```bash
   git add .
   git commit -m "Add Jordan personality and deployment config"
   git push origin main
   ```

### **Step 2: Deploy to Railway**
1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"** → "Deploy from GitHub repo"
4. **Select your repository**
5. **Add Environment Variables**:
   - `SLACK_BOT_TOKEN` = your bot token
   - `SLACK_SIGNING_SECRET` = your signing secret
   - `SLACK_APP_TOKEN` = your app token
   - `OPENAI_API_KEY` = your OpenAI key
   - `BOT_NAME` = Jordan
   - `TIMEZONE` = your timezone

### **Step 3: Deploy**
1. **Click "Deploy"**
2. **Wait for build** (usually 2-3 minutes)
3. **Your bot will be running 24/7!**

## 🌐 **Alternative Hosting Options**

### **Render (Free)**
1. **Go to [render.com](https://render.com)**
2. **New Web Service** → Connect GitHub
3. **Environment**: Node
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Add environment variables** same as above

### **Heroku ($5/month)**
1. **Install Heroku CLI**
2. **Create app**: `heroku create your-bot-name`
3. **Set environment variables**:
   ```bash
   heroku config:set SLACK_BOT_TOKEN=xoxb-your-token
   heroku config:set OPENAI_API_KEY=sk-your-key
   # ... etc
   ```
4. **Deploy**: `git push heroku main`

## 🔧 **Environment Variables Required**
```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_SIGNING_SECRET=your-signing-secret
SLACK_APP_TOKEN=xapp-your-app-token
OPENAI_API_KEY=sk-your-openai-key
BOT_NAME=Jordan
TIMEZONE=America/New_York
```

## ✅ **After Deployment**
- **Bot runs 24/7** without manual start
- **Automatic restarts** if it crashes
- **Scheduled reminders** work continuously
- **No more `npm start`** needed locally

## 🎉 **Benefits of Hosting**
- **Always available** for your team
- **Professional reliability**
- **No local computer dependency**
- **Easy scaling** if needed

**Ready to deploy? Railway is the easiest option to get started!**
