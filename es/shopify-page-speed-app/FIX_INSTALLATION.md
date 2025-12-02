# ⚙️ Complete Setup Guide - Fix App Installation

## 🔴 Common Issue: Missing Redirect URLs

**Why it's not installing:**
Your Shopify app in Partner Dashboard needs **Redirect URLs** configured. Without these, Shopify can't complete the OAuth flow.

---

## ✅ Solution: Add Redirect URLs

### Step 1: Go to Shopify Partner Dashboard

1. Open: **https://partners.shopify.com**
2. Click **"Apps and sales channels"**
3. Find and click **"page-spped"** app
4. Go to **"Configuration"** or **"Settings"** tab

### Step 2: Find the Redirect URLs Section

Look for section called:
- **"Redirect URLs"** or
- **"OAuth redirect URIs"** or  
- **"Authorized redirect URLs"**

### Step 3: Add These Redirect URLs

Add **ALL THREE** of these URLs:

```
http://localhost:3000/auth/callback
http://localhost:3000
http://localhost:3000/webhooks
```

**How to add them:**
1. Click **"Add URL"** or **"+"** button
2. Paste the first URL
3. Click **"Add"** or **"Save"**
4. Repeat for other URLs

### Step 4: Save Configuration

1. Click **"Save"** button at bottom
2. Wait for confirmation message
3. Close the settings

---

## 📋 Full Configuration Checklist

### In Shopify Partner Dashboard - App Configuration:

**Basic Info:**
- ✅ App name: `page-spped`
- ✅ Client ID: `ba85518722bd9242529c988886bbe226`
- ✅ Client Secret: `shpss_9f97d1fa23aebdd499e7a4ebb26f6d4`

**URLs Section:**
- ✅ App URL: `http://localhost:3000`
- ✅ Preferences URL: (leave empty or `http://localhost:3000`)

**Redirect URLs:**
- ✅ `http://localhost:3000/auth/callback`
- ✅ `http://localhost:3000`
- ✅ `http://localhost:3000/webhooks`

**Scopes:**
- ✅ `write_products`
- ✅ `read_products`
- ✅ `write_pages`
- ✅ `read_pages`
- ✅ `write_themes`
- ✅ `read_themes`

---

## 🔧 Backend Configuration - Already Done

**In your `.env` file:**
```
SHOPIFY_API_KEY=ba85518722bd9242529c988886bbe226
SHOPIFY_API_SECRET=shpss_9f97d1fa23aebdd499e7a4ebb26f6d4
SHOPIFY_APP_URL=http://localhost:3000
SCOPES=write_products,read_products,write_pages,read_pages,write_themes,read_themes
PORT=3000
NODE_ENV=development
```

✅ **This is already correctly configured!**

---

## 🔍 Verification Checklist

### Server Status:
- ✅ Backend running on port 3000
- ✅ Frontend running on port 3002
- ✅ API responding at http://localhost:3000/health

### Shopify Configuration:
- ⏳ App URL set to http://localhost:3000
- ⏳ Redirect URLs added (THIS IS THE KEY!)
- ⏳ API credentials saved

### Store Setup:
- ✅ Store: sandhiaaaa
- ✅ Store URL: https://admin.shopify.com/store/sandhiaaaa/

---

## 🚀 After Adding Redirect URLs

### Step 1: Wait 2-3 Minutes
Shopify needs time to process the changes.

### Step 2: Try Installation Again

Use your installation link:
```
https://admin.shopify.com/store/sandhiaaaa/apps/install/ba85518722bd9242529c988886bbe226
```

### Step 3: Grant Permissions

When prompted:
1. Click "Install"
2. Review permissions
3. Click "Install" again
4. Wait for redirect

### Step 4: Verify in Store Admin

After installation:
1. Go to: `https://admin.shopify.com/store/sandhiaaaa/`
2. Look in left menu for "Apps"
3. Find "page-spped"
4. Click to open dashboard

---

## ⚠️ Still Not Working? Try These:

### Fix 1: Clear Browser Cache
- Press **Ctrl + Shift + Delete**
- Clear all cookies and cache
- Refresh page
- Try installation link again

### Fix 2: Use Incognito Mode
- Open **Ctrl + Shift + N** (private/incognito)
- Paste installation link
- Try installing

### Fix 3: Check Firewall
- Make sure firewall isn't blocking port 3000
- On Windows: Go to Windows Defender > Firewall > Allow app through firewall
- Allow Node.js

### Fix 4: Restart Backend
```bash
# Stop backend (Ctrl+C)
cd c:\Users\01\Desktop\es\shopify-page-speed-app\web\backend
node index.ts
```

### Fix 5: Check Browser Console
1. Click installation link
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for red error messages
5. Share errors with me

---

## 📱 Common Error Messages & Solutions

**Error: "Invalid redirect_uri"**
- Solution: Check redirect URLs in Partner Dashboard
- Make sure you added all 3 URLs

**Error: "Client not found"**
- Solution: Verify Client ID matches in Dashboard
- Check if app exists in Partner Dashboard

**Error: "Not found"**
- Solution: Backend not running
- Check if http://localhost:3000/health responds

**Error: "Unauthorized"**
- Solution: API Secret might be wrong
- Double-check credentials in Partner Dashboard

---

## 🎯 Priority: Add Redirect URLs NOW

**This is the most common reason for installation failure!**

1. Go to Partner Dashboard
2. Find "page-spped" app
3. Go to Configuration
4. Add these 3 redirect URLs:
   - http://localhost:3000/auth/callback
   - http://localhost:3000
   - http://localhost:3000/webhooks
5. Click Save
6. Wait 2-3 minutes
7. Try installation again

---

## ✅ Success Indicators

After doing this, you should:
1. See installation page load immediately
2. See "Install" button (not blocked)
3. See permissions dialog
4. Be able to click "Install"
5. Be redirected to store admin
6. See app in left menu within 1-2 minutes

---

## 📞 Need More Help?

**Check these files for more info:**
- `INSTALLATION_GUIDE.md` - Full setup guide
- `INSTALL_ON_STORE.md` - Installation steps
- `README.md` - Technical details
- `USER_GUIDE.md` - How to use the app

**Or tell me:**
1. What error message you see?
2. What happens when you click the link?
3. Does installation page load?

---

## 🚀 Quick Action Items

**DO THIS NOW:**

1. ✅ **Add Redirect URLs** to your Shopify app (MOST IMPORTANT!)
   - http://localhost:3000/auth/callback
   - http://localhost:3000
   - http://localhost:3000/webhooks

2. ✅ **Wait 2-3 minutes** for changes to take effect

3. ✅ **Try installation link again:**
   ```
   https://admin.shopify.com/store/sandhiaaaa/apps/install/ba85518722bd9242529c988886bbe226
   ```

4. ✅ **Report back** what happens!

---

**This should fix your installation issue!** 🎉
