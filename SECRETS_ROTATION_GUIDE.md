# Secrets Rotation & Connectivity Guide

## ⚠️ IMPORTANT: Your Secrets Are Exposed

Your previous `.env` file contained real credentials. **Rotate all secrets immediately:**

---

## 1. MongoDB Atlas Rotation

### Step 1: Change Database User Password
1. Go to [MongoDB Atlas Console](https://cloud.mongodb.com)
2. Select your project → **Database Access** (left sidebar)
3. Find your user (`nandkishorjadhav9580_db_user`)
4. Click **Edit** → Generate new password → Copy it
5. Update `.env`: 
   ```
   MONGODB_URI=mongodb+srv://nandkishorjadhav9580_db_user:NEW_PASSWORD@cluster0.zrjucq1.mongodb.net/?appName=Cluster0
   ```

### Step 2: Verify IP Whitelist
1. In Atlas → **Network Access** (left sidebar)
2. Check if your IP is whitelisted (should see `0.0.0.0/0` for development or your specific IP)
3. If missing, click **Add IP** → Enter your public IP or use `0.0.0.0/0` (dev only)

### Step 3: Get Connection String Options
1. In Atlas → **Databases** → Click **Connect** on your cluster
2. Choose connection method:
   - **SRV Connection** (recommended): `mongodb+srv://...`
   - **Standard Connection** (if SRV fails): Copy the standard connection string
3. Replace credentials with your new password

---

## 2. Gmail App Password Rotation

### Step 1: Generate New App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go back to Security → **App passwords**
4. Select **Mail** and **Windows Computer** → Generate
5. Copy the 16-character password

### Step 2: Update `.env`
```
EMAIL_USER=nandkishorjadhav9580@gmail.com
EMAIL_PASSWORD=your_new_16_char_password
```

---

## 3. MSG91 API Key Rotation

### Step 1: Generate New Key
1. Go to [MSG91 Dashboard](https://control.msg91.com)
2. Login → **Settings** → **API Configuration**
3. Generate new **Auth Key** (or request from support)
4. Copy the new key

### Step 2: Update `.env`
```
MSG91_AUTH_KEY=your_new_auth_key_here
```

---

## 4. Verify MongoDB Connectivity (Windows)

### Quick DNS Test
```powershell
# Test if SRV records are resolvable
nslookup -type=SRV _mongodb._tcp.cluster0.zrjucq1.mongodb.net

# Test basic DNS
nslookup cluster0.zrjucq1.mongodb.net
```

### If DNS Test Fails:

**Option A: Change Network DNS**
1. Windows Settings → Network & Internet → Change adapter options
2. Right-click your connection → Properties
3. Double-click IPv4 → Use DNS: `8.8.8.8` and `1.1.1.1` (Google DNS)
4. Click OK, then in terminal:
   ```powershell
   ipconfig /flushdns
   ipconfig /release
   ipconfig /renew
   ```

**Option B: Use Standard Connection String** (if Option A doesn't work)
1. In MongoDB Atlas Connect dialog, switch to **Standard connection**
2. Copy the string that looks like:
   ```
   mongodb://user:pass@cluster0-shard-00-00.xxxxx.mongodb.net:27017,...
   ```
3. Replace in `.env` as `MONGODB_URI`

---

## 5. Test Connection Locally

### Step 1: Update `.env` with new credentials
```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://nandkishorjadhav9580_db_user:YOUR_NEW_PASSWORD@cluster0.zrjucq1.mongodb.net/?appName=Cluster0
JWT_SECRET=UlHPq+S5lkqmfwGO51dejBG7rCRiGJb1NORJOZo5K3lLI67KITTuJN2n/9aNthCJ
EMAIL_USER=nandkishorjadhav9580@gmail.com
EMAIL_PASSWORD=your_new_gmail_app_password
MSG91_AUTH_KEY=your_new_msg91_key
```

### Step 2: Start Server
```bash
cd Server
npm start
```

### Step 3: Check Health Endpoint
```bash
# In another terminal
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Grocery Management API is running",
  "database": "connected"
}
```

---

## 6. If Still Failing: Troubleshooting

| Issue | Solution |
|-------|----------|
| `querySrv ECONNREFUSED` | Use standard connection string or change DNS to 8.8.8.8 |
| `authentication failed` | Verify password is correct in Atlas → Database Access |
| `IP not whitelisted` | Add your IP in Atlas → Network Access |
| `Timeout after 10s` | Check internet connection; Atlas may be slow |
| `Password has special chars` | URL-encode them (e.g., `@` → `%40`) in connection string |

---

## 7. After Verification: Clean Up

Once connected successfully:
1. ✅ Delete old `.env.example` or update it with blanks
2. ✅ Add `.env` to `.gitignore` (never commit real passwords)
3. ✅ Verify `.gitignore` includes: `node_modules/`, `.env`, `.DS_Store`, etc.
4. ✅ If already committed to Git, use: `git rm --cached .env` then commit

---

## Checklist

- [ ] Rotated MongoDB Atlas user password
- [ ] Updated MONGODB_URI in `.env`
- [ ] Verified IP is whitelisted in Atlas
- [ ] Generated new Gmail app password
- [ ] Generated new MSG91 API key
- [ ] Tested DNS: `nslookup _mongodb._tcp.cluster0.zrjucq1.mongodb.net`
- [ ] Started server and checked `/api/health` endpoint
- [ ] Database shows "connected" status
- [ ] `.env` is in `.gitignore`
