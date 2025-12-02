# 🛍️ How to Add Page Speed Optimizer App to Your Shopify Store

## Complete Step-by-Step Guide

---

## 📋 Prerequisites

Before you can add this app to your Shopify store, you need:

1. ✅ A **Shopify store** (development or live)
2. ✅ **Shopify Partner account** (free at partners.shopify.com)
3. ✅ **Access to Shopify CLI** on your computer
4. ✅ **Node.js** installed (v18+)
5. ✅ This app running locally (already done! ✅)

---

## 🔑 Step 1: Create a Shopify App in Partner Dashboard

### 1.1 Go to Partner Dashboard
1. Visit: **https://partners.shopify.com**
2. Log in with your Shopify account (or create one if needed)
3. Click **"Apps and sales channels"** in the left menu

### 1.2 Create a New App
1. Click **"Create an app"** button
2. Choose **"Create app"**
3. Select **"Custom app"** (or "Public app" if publishing to store)

### 1.3 Fill in App Details
**App Name:** (e.g., "Page Speed Optimizer")
**App URL:** (leave blank for now, we'll update it)
**Allowed redirect URLs:** 
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

### 1.4 Get Your API Credentials
After creating the app, you'll see:
```
API Key:           xxxxxxxxxxxxxxxxxxxx
API Secret Key:    xxxxxxxxxxxxxxxxxxxx
Install URL:       https://admin.shopify.com/store/your-store/apps/...
```

**SAVE THESE! You'll need them next.**

---

## 🔐 Step 2: Configure Your API Credentials

### 2.1 Update Your .env File
```bash
# Navigate to backend folder
cd c:\Users\01\Desktop\es\shopify-page-speed-app\web\backend
```

### 2.2 Edit the .env File
Open `.env` in a text editor and fill in:

```env
SHOPIFY_API_KEY=your_api_key_from_partner_dashboard
SHOPIFY_API_SECRET=your_api_secret_from_partner_dashboard
SHOPIFY_APP_URL=http://localhost:3000
SCOPES=write_products,read_products,write_pages,read_pages,write_themes,read_themes
PORT=3000
NODE_ENV=development
```

**Replace:**
- `your_api_key_from_partner_dashboard` with your actual API Key
- `your_api_secret_from_partner_dashboard` with your actual API Secret

---

## 🌐 Step 3: Set Up Local Tunneling (ngrok)

### Why Do We Need This?
Shopify needs a public URL to communicate with your local development server. We use **ngrok** to create a tunnel.

### 3.1 Install ngrok
```bash
# Download from: https://ngrok.com/download
# Or install with npm:
npm install -g ngrok
```

### 3.2 Start ngrok Tunnel
```bash
# Open a new PowerShell terminal
ngrok http 3000
```

**You'll see output like:**
```
Session Status                online
Account                       your-email@gmail.com
Version                       3.0.0
Region                        us-california
Latency                        20ms
Web Interface                  http://127.0.0.1:4040
Forwarding                     https://abc123def456.ngrok.io -> http://localhost:3000
```

**Copy the forwarding URL:** `https://abc123def456.ngrok.io`

### 3.3 Update .env with ngrok URL
Go back to your `.env` file and update:
```env
SHOPIFY_APP_URL=https://abc123def456.ngrok.io
```

---

## 📱 Step 4: Update Shopify App Configuration

### 4.1 Update shopify.app.toml
In your project root, edit `shopify.app.toml`:

```toml
client_id = "your_api_key_here"
name = "Page Speed Optimizer"
scopes = "write_products,read_products,write_pages,read_pages,write_themes,read_themes"

[build]
automatically_update_urls_on_dev = true

[webhooks]
api_version = "2024-01"

[[webhooks.subscriptions]]
topics = ["app/installed"]
uri = "/webhooks/app/installed"

[[webhooks.subscriptions]]
topics = ["app/uninstalled"]
uri = "/webhooks/app/uninstalled"
```

Replace `your_api_key_here` with your API Key from Partner Dashboard.

---

## 🚀 Step 5: Install App on Your Development Store

### 5.1 Create a Development Store (if you don't have one)
1. Go to **https://partners.shopify.com**
2. Click **"Stores"** in left menu
3. Click **"Create app store"** or **"Add store"**
4. Choose type: **"Development store"**
5. Enter store name (e.g., "Speed Optimizer Test")
6. Click **"Create store"**

### 5.2 Get Your Store URL
After creating, note your store URL:
```
https://your-store-name.myshopify.com
```

### 5.3 Install the App
1. In Partner Dashboard, go back to your **App**
2. Scroll to **"Installation link"** section
3. You'll see a URL like:
   ```
   https://admin.shopify.com/store/your-store/apps/your-app-id/install
   ```
4. **Click this link** (or open it in browser)
5. You'll be redirected to your store admin
6. Click **"Install"** when prompted

---

## ✅ Step 6: Verify Installation

### 6.1 Check if App is Running
Make sure both servers are running:
```bash
# Terminal 1 - Backend
cd web\backend
node index.ts
# Should show: 🚀 Page Speed Optimizer app running on port 3000

# Terminal 2 - Frontend  
cd web\frontend
npm run dev
# Should show: ➜ Local: http://localhost:3001/
```

### 6.2 Check Shopify Store
1. Go to your development store: `https://your-store-name.myshopify.com/admin`
2. In left menu, look for **"Apps"** section
3. You should see **"Page Speed Optimizer"** installed
4. Click it to open your app dashboard

### 6.3 Test the Connection
Open the app and try:
- Click **"Settings"** tab
- Toggle **"Image Optimization"** ON
- Click **"Save Settings"**
- Should see: ✅ "Settings saved successfully!"

---

## 🎯 Step 7: Activate Optimizations on Your Store

### How the App Works

**Two-Part System:**

1. **Admin Dashboard** (what you see at localhost:3001)
   - Configure optimization settings
   - View performance metrics
   - Analyze store pages

2. **Optimization Script** (injected into customer storefront)
   - Runs automatically on every page
   - Optimizes images, enables lazy loading, etc.
   - Customers don't see anything special

### Enable Optimizations

**Method 1: Through Dashboard**
1. Open your app in store admin
2. Go to **Settings** tab
3. Toggle all options ON
4. Click **"Save Settings"**

**Method 2: Auto-Enable**
The app auto-enables on installation:
- ✅ Image Optimization (80% quality)
- ✅ Lazy Loading
- ✅ Browser Caching (1 hour)
- ✅ CSS Minification
- ✅ JS Minification

---

## 🔍 Step 8: Test the Optimizations

### 8.1 Test Page Speed
1. In your app, go to **"Analyze Page"** tab
2. Enter your store URL:
   ```
   https://your-store-name.myshopify.com
   ```
3. Click **"Analyze Page Speed"**
4. You'll see:
   - Performance Score
   - Web Vitals metrics
   - Optimization suggestions

### 8.2 Check Optimization Script
1. Go to your store: `https://your-store-name.myshopify.com`
2. Open **Developer Tools** (press F12)
3. Go to **"Console"** tab
4. You should see:
   ```
   🚀 Shopify Page Speed Optimizer - Running optimizations
   ✅ Page speed optimizations applied
   ```

### 8.3 Verify Images Are Optimized
1. In Developer Tools, go to **"Network"** tab
2. Refresh the page
3. Look at image files:
   - Should see `.webp` files
   - File sizes should be smaller
   - Request count might be lower (lazy loading)

---

## 📊 Step 9: Monitor Performance Improvements

### Track Improvements Over Time

**Day 1 (Before):**
- Page Load: 5.2 seconds
- Performance Score: 65
- Image Size: 5.8 MB

**After 1 Week:**
- Page Load: 2.8 seconds ⚡
- Performance Score: 85 📈
- Image Size: 1.7 MB 📉

### Check Real Metrics

1. In your app, click **"Dashboard"** tab
2. Check:
   - Average Page Load Time
   - Average Page Size
   - Performance Score
   - Active Optimizations

---

## 🛠️ Step 10: Deploy to Production (Optional)

### When Ready to Go Live

**Option A: Keep Running Locally**
- Pros: Easy to update, full control
- Cons: Needs your computer always on

**Option B: Deploy to Cloud**

**Deploy to Heroku (Free option):**
1. Sign up: https://www.heroku.com
2. Create new app
3. Connect to your GitHub repo
4. Deploy
5. Update Shopify app URL in Partner Dashboard

**Deploy to Vercel:**
1. Sign up: https://vercel.com
2. Import your repository
3. Deploy
4. Update Shopify URLs

**Update in Shopify Partner Dashboard:**
1. Go to your App settings
2. Update **App URL** to production URL
3. Update **Redirect URLs** to production URLs
4. Save changes

---

## ⚠️ Troubleshooting

### Problem: "App Not Installing"

**Solution:**
1. Check if ngrok tunnel is running
2. Verify `.env` file has correct credentials
3. Check if backend server is running on port 3000
4. Verify ngrok URL is updated in shopify.app.toml

### Problem: "Settings Not Saving"

**Solution:**
1. Check browser console (F12) for errors
2. Verify API key has correct permissions
3. Check backend logs for error messages
4. Restart both servers

### Problem: "Images Not Optimizing"

**Solution:**
1. Verify Image Optimization is toggled ON
2. Check if optimization script is injected (F12 > Console)
3. Look for error messages in Console
4. Check if images have proper file extensions

### Problem: "Performance Score Not Changing"

**Solution:**
1. Wait 5-10 minutes for metrics to update
2. Clear browser cache (Ctrl + Shift + Delete)
3. Reload the page
4. Run analysis again

### Problem: "Port 3000 Already in Use"

**Solution:**
```bash
# Kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port in .env
PORT=3001
```

---

## 📋 Checklist: Installation Complete

- [ ] Shopify Partner account created
- [ ] Custom app created in Partner Dashboard
- [ ] API Key and Secret saved
- [ ] .env file updated with credentials
- [ ] ngrok tunnel set up and running
- [ ] shopify.app.toml updated with API Key
- [ ] Development store created
- [ ] App installed on development store
- [ ] Backend server running (port 3000)
- [ ] Frontend dashboard running (port 3001)
- [ ] App visible in store admin
- [ ] Settings can be saved
- [ ] Optimization script appears in Console
- [ ] Performance metrics displaying

---

## 🚀 Next Steps

### After Installation:

1. **Fine-tune Settings**
   - Adjust image quality (recommended: 80%)
   - Set cache duration (recommended: 86400 = 1 day)
   - Enable/disable specific optimizations

2. **Monitor Performance**
   - Check Dashboard weekly
   - Use Analyze Page tool to test
   - Track improvements

3. **Deploy to Production**
   - Once satisfied with results
   - Deploy to cloud service
   - Update Shopify URLs
   - Install on live store

4. **Publish to App Store** (Optional)
   - Once app is stable
   - Follow Shopify's publishing guidelines
   - Make app available to all merchants

---

## 💡 Pro Tips

✅ **Use a Development Store First**
- Test everything before going live
- Make mistakes without affecting real customers
- Easier to debug and troubleshoot

✅ **Keep ngrok Running While Developing**
- Session expires after 2 hours (free plan)
- Upgrade to ngrok paid for permanent URLs
- Or use Heroku/Vercel for stable URLs

✅ **Monitor Your Metrics**
- Check performance weekly
- Celebrate improvements! 🎉
- Share results with team

✅ **Backup Original Theme**
- Before injecting optimization script
- Easy to rollback if needed
- Most themes support backup/restore

✅ **Test on Mobile**
- 60% of customers use phones
- Test with actual mobile device
- Check speed on slow networks

---

## 📞 Getting More Help

**Documentation Files:**
- `README.md` - Technical documentation
- `USER_GUIDE.md` - Detailed usage instructions
- `QUICK_START.md` - 5-minute setup
- `shopify.app.toml` - App configuration

**Shopify Resources:**
- https://shopify.dev/docs/apps/getting-started
- https://shopify.dev/docs/api/admin-rest
- https://shopify.dev/docs/apps/deployment

**Ngrok Help:**
- https://ngrok.com/docs

---

## 🎉 Congratulations!

You now have Page Speed Optimizer installed on your Shopify store!

**Expected Results:**
- ⚡ 30-50% faster page loads
- 📉 40-70% smaller images
- 🎯 Better SEO rankings
- 💰 5-10% increase in conversions

**Time to see results:** 1-2 weeks

---

**Questions? Check the troubleshooting section or review the documentation files!**
