# 🚀 Deployment Guide for Render.com

## Prerequisites

- GitHub account
- Render.com account
- Your API keys (Supabase, OpenAI, Cloudinary)

## Step 1: Set Up GitHub Repository

1. **Create a new repository on GitHub**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name: `chinese-tutor-app`
   - Make it **Public** (required for Render free tier)
   - Don't initialize with README, .gitignore, or license

2. **Set up your local project**
   ```bash
   # Run the setup script
   chmod +x setup.sh
   ./setup.sh
   
   # Initialize git and push to GitHub
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chinese-tutor-app.git
   git push -u origin main
   ```

## Step 2: Deploy Backend on Render

1. **Go to [render.com](https://render.com) and sign up/login**

2. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account if not already connected
   - Select your `chinese-tutor-app` repository

3. **Configure the service:**
   - **Name**: `chinese-tutor-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. **Add Environment Variables:**
   - Click "Environment" tab
   - Add these variables (copy from your `.env` file):
     ```
     NODE_ENV=production
     PORT=10000
     FRONTEND_URL=https://chinese-tutor-frontend.onrender.com
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     OPENAI_API_KEY=your_openai_api_key
     CLOUDINARY_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build and deployment (usually 2-5 minutes)
   - Note your backend URL: `https://chinese-tutor-backend.onrender.com`

## Step 3: Deploy Frontend on Render

1. **Create a new Static Site**
   - Click "New +" → "Static Site"
   - Select your `chinese-tutor-app` repository

2. **Configure the service:**
   - **Name**: `chinese-tutor-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `public`
   - **Plan**: `Free`

3. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (usually 1-2 minutes)
   - Note your frontend URL: `https://chinese-tutor-frontend.onrender.com`

## Step 4: Update Frontend Configuration

1. **Update your backend URL in the frontend**
   - In your GitHub repo, edit `public/index.html`
   - Replace all API calls to use your backend URL
   - Commit and push changes

2. **Redeploy frontend**
   - Render will automatically redeploy when you push changes

## Step 5: Test Your Deployment

1. **Test backend health:**
   ```
   https://chinese-tutor-backend.onrender.com/api/health
   ```

2. **Test frontend:**
   ```
   https://chinese-tutor-frontend.onrender.com
   ```

## Troubleshooting

### Common Issues:

1. **Build fails**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is compatible (18+)

2. **Environment variables not working**
   - Double-check spelling in Render dashboard
   - Ensure no extra spaces or quotes

3. **CORS errors**
   - Verify `FRONTEND_URL` is set correctly in backend
   - Check that frontend URL matches exactly

4. **API calls failing**
   - Check browser console for errors
   - Verify backend URL is correct in frontend code

### Getting Help:

- Check Render logs in the dashboard
- Review GitHub Actions if you have them enabled
- Check browser developer tools for frontend errors

## Cost Considerations

- **Free tier**: Both services are free
- **Limitations**: 
  - Backend sleeps after 15 minutes of inactivity
  - 750 hours/month free
  - 100GB bandwidth/month

## Next Steps

- Set up custom domain if desired
- Configure monitoring and alerts
- Set up CI/CD pipeline
- Add SSL certificates (automatic on Render)

---

🎉 **Congratulations!** Your Chinese Tutor app is now live on the internet!
