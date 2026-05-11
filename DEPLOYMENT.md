# MediAI Full-Stack Deployment Guide 🚀

This guide covers how to deploy all three parts of the **MediAI** platform to production environments.

> **Note:** The platform consists of 3 distinct services, which should ideally be deployed to different hosting providers suited for their specific technologies:
> 1. **MongoDB Database** → MongoDB Atlas
> 2. **Node.js Backend** → Render, Heroku, or DigitalOcean
> 3. **Python AI Service** → Render or Heroku
> 4. **React Frontend** → Vercel or Netlify

---

## 1. Database Deployment (MongoDB Atlas)

Before deploying the backend, you need a cloud database.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Build a new free cluster (M0).
3. Under **Database Access**, create a new database user (save the username and password).
4. Under **Network Access**, add `0.0.0.0/0` to allow access from anywhere (or specify your backend server IPs for better security).
5. Click **Connect** on your cluster, choose "Connect your application", and copy the connection string.
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mediai?retryWrites=true&w=majority`

---

## 2. Python AI Service Deployment (Render)

We'll deploy the AI service first because the Node.js backend might rely on it.

1. Create an account on [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository containing the MediAI project.
4. Fill in the deployment details:
   - **Name**: `mediai-ai-service`
   - **Root Directory**: `ai-service`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app` (Make sure `gunicorn` is in your `requirements.txt`)
5. Click **Create Web Service**.
6. Once deployed, copy the service URL (e.g., `https://mediai-ai-service.onrender.com`).

> **Warning:** If you don't have `gunicorn` in `ai-service/requirements.txt`, you need to add it before deploying to Render. You can also use `python app.py` as a start command for testing, but `gunicorn` is required for production.

---

## 3. Node.js Backend Deployment (Render)

1. Go to Render dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Fill in the deployment details:
   - **Name**: `mediai-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Expand **Environment Variables** and add the following keys:
   - `PORT`: `5000` (Render will override this, but it's safe to include)
   - `MONGODB_URI`: *[Your MongoDB Atlas connection string from step 1]*
   - `JWT_SECRET`: *[Generate a strong random string]*
   - `FRONTEND_URL`: *[Leave blank for now, you will update this after deploying the frontend]*
   - `AI_SERVICE_URL`: *[The URL from step 2, e.g., https://mediai-ai-service.onrender.com]*
5. Click **Create Web Service**.
6. Copy the deployed backend URL (e.g., `https://mediai-backend.onrender.com`).

---

## 4. React Frontend Deployment (Vercel)

Vercel is the easiest platform for Vite/React applications.

1. Go to [Vercel.com](https://vercel.com/) and create an account.
2. Click **Add New Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
5. Expand **Environment Variables** and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://mediai-backend.onrender.com/api` *(Your backend URL from step 3)*
6. Click **Deploy**.
7. Once deployed, copy your frontend URL (e.g., `https://mediai.vercel.app`).

---

## 5. Final Connections

Now you need to tell your backend to trust requests coming from your newly deployed frontend.

1. Go back to your **Node.js Backend** settings on Render.
2. Update the `FRONTEND_URL` environment variable to your Vercel URL (e.g., `https://mediai.vercel.app`).
3. Render will automatically restart your backend.

> **Tip:** If you want to seed your production database with demo accounts, you can temporarily connect to your MongoDB Atlas cluster locally using MongoDB Compass and run the seed script locally, or create a temporary route/script on your backend.

## 🌟 Verification

To ensure everything works:
1. Open your Vercel frontend URL.
2. Try registering a new patient account (this verifies the DB connection).
3. Try logging in.
4. Open the Symptom Checker (this verifies the AI service connection).

Your application is now live! 🎉
