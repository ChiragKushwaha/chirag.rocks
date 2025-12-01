# macOS Socket Server

Socket.IO server for macOS clone FaceTime and Messages functionality.

## Deploy to Railway

### Quick Deploy

1. **Push your code to GitHub** (if not already done)
2. **Go to Railway**: https://railway.app
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**
5. **Configure the service**:
   - **Root Directory**: `server` (if deploying from monorepo)
   - **Start Command**: `npm start`
   - **Build Command**: `npm install`
6. **Add a custom domain** (optional) or use the Railway-provided domain
7. **Deploy!**

Railway will automatically:
- Install dependencies
- Start the server
- Provide you with a public URL

### After Deployment

1. **Copy the Railway URL** (e.g., `https://your-app.up.railway.app`)
2. **Update the client code**:
   - Open `/store/socketStore.ts`
   - Change `SOCKET_URL` to your Railway URL
   - Set `ENABLE_SOCKET = true`
3. **Redeploy your Vercel app**

## Environment Variables

No environment variables required. The server uses `process.env.PORT` which Railway sets automatically.

## CORS Configuration

The server is configured to allow connections from:
- `http://localhost:3000`
- `http://localhost:3001`
- `https://chirag-rocks.vercel.app`

## Local Development

```bash
npm install
npm run dev
```

Server will run on port 3001 (or PORT environment variable).
